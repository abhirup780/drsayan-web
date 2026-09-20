"""Build the height-for-age LMS reference used by the growth checker.

Two references, because no single one covers childhood in India:

  WHO Child Growth Standards (2006), length/height-for-age, birth to 5 years.
    A prescriptive *standard*: how healthy, breastfed children in optimal
    conditions do grow, across six countries including India.

  IAP 2015 growth charts, height-for-age, 5 to 18 years.
    A descriptive *reference* for Indian children. Khadilkar V et al,
    Indian Pediatrics 2015;52:47-55. This is the chart Indian paediatricians
    plot on after 5, and the one the IAP's own SDS calculator uses.

Only height matters here; weight and BMI columns are ignored.

Two details that are easy to get wrong and are handled explicitly:

  1. WHO switches from recumbent LENGTH to standing HEIGHT at 24 months, and
     bakes a -0.7 cm adjustment into the table at day 731. Interpolating
     across that step would invent a child who shrinks overnight, so the two
     segments are kept separate and never interpolated across.

  2. The WHO table is per day. Sampling it monthly moves a z-score by up to
     0.148, which is enough to push a child across the -2 SD line. Weekly
     sampling holds the error to 0.004. The script asserts this.

Run:  python scripts/build-growth-lms.py
Writes: src/lib/growth/lms-data.ts

No third-party packages: an .xlsx is a zip of XML and the standard library
can read it.
"""

import bisect
import json
import math
import os
import re
import zipfile
from xml.etree import ElementTree as ET

NS = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "growth-source")
OUT = os.path.join(ROOT, "src", "lib", "growth", "lms-data.ts")

# WHO switches length -> height here; never interpolate across it.
SWITCH_DAY = 731
MAX_DAY = 1856
WEEK = 7


# ---------------------------------------------------------------- xlsx ----
def _load(path):
    z = zipfile.ZipFile(path)
    shared = []
    if "xl/sharedStrings.xml" in z.namelist():
        root = ET.fromstring(z.read("xl/sharedStrings.xml"))
        for si in root.findall(f"{NS}si"):
            shared.append("".join(t.text or "" for t in si.iter(f"{NS}t")))
    wbx = z.read("xl/workbook.xml").decode("utf-8", "replace")
    names = re.findall(r'<sheet[^>]*name="([^"]+)"[^>]*r:id="([^"]+)"', wbx)
    rels = z.read("xl/_rels/workbook.xml.rels").decode("utf-8", "replace")
    relmap = dict(re.findall(r'Id="([^"]+)"[^>]*Target="([^"]+)"', rels))
    return z, shared, {n: "xl/" + relmap[r].lstrip("/") for n, r in names}


def _cells(z, shared, part):
    root = ET.fromstring(z.read(part))
    grid = {}
    for c in root.iter(f"{NS}c"):
        ref, t = c.get("r"), c.get("t")
        v, isel = c.find(f"{NS}v"), c.find(f"{NS}is")
        if isel is not None:
            val = "".join(x.text or "" for x in isel.iter(f"{NS}t"))
        elif v is None:
            continue
        elif t == "s":
            val = shared[int(v.text)]
        elif t in ("str", "e"):
            val = v.text
        else:
            try:
                val = float(v.text)
            except (TypeError, ValueError):
                val = v.text
        m = re.match(r"([A-Z]+)(\d+)", ref)
        col = 0
        for ch in m.group(1):
            col = col * 26 + (ord(ch) - 64)
        grid[(int(m.group(2)), col)] = val
    return grid


# ----------------------------------------------------------------- LMS ----
def lms_z(L, M, S, x):
    return math.log(x / M) / S if abs(L) < 1e-9 else ((x / M) ** L - 1) / (L * S)


def lms_x(L, M, S, z):
    return M * math.exp(S * z) if abs(L) < 1e-9 else M * (1 + L * S * z) ** (1 / L)


def interp(knots, table, day):
    """Linear interpolation of (M, S) between weekly knots."""
    i = bisect.bisect_right(knots, day) - 1
    i = max(0, min(i, len(knots) - 1))
    if knots[i] == day or i + 1 >= len(knots):
        return table[knots[i]][1], table[knots[i]][2]
    a, b = knots[i], knots[i + 1]
    t = (day - a) / (b - a)
    return (
        table[a][1] + t * (table[b][1] - table[a][1]),
        table[a][2] + t * (table[b][2] - table[a][2]),
    )


# ----------------------------------------------------------------- WHO ----
def read_who(sex):
    z, shared, sheets = _load(os.path.join(SRC, f"who-lhfa-{sex}-zscore-expanded.xlsx"))
    g = _cells(z, shared, next(iter(sheets.values())))
    tbl, published = {}, {}
    for r in range(2, 2000):
        d = g.get((r, 1))
        if not isinstance(d, float):
            continue
        d = int(d)
        tbl[d] = (g[(r, 2)], g[(r, 3)], g[(r, 4)])
        # WHO also publishes the height at each whole z; used to self-check.
        published[d] = {
            -3: g[(r, 6)], -2: g[(r, 7)], -1: g[(r, 8)],
            0: g[(r, 9)], 1: g[(r, 10)], 2: g[(r, 11)], 3: g[(r, 12)],
        }
    assert min(tbl) == 0 and max(tbl) == MAX_DAY, f"unexpected WHO day range for {sex}"
    assert {v[0] for v in tbl.values()} == {1.0}, "WHO L is expected to be 1 throughout"
    return tbl, published


def who_knots(tbl):
    """Weekly knots, with both sides of the length/height switch pinned."""
    out = []
    for lo, hi in ((0, SWITCH_DAY - 1), (SWITCH_DAY, MAX_DAY)):
        ks = list(range(lo, hi + 1, WEEK))
        if ks[-1] != hi:
            ks.append(hi)
        out.append(ks)
    return out


# ----------------------------------------------------------------- IAP ----
def read_iap():
    z, shared, sheets = _load(os.path.join(SRC, "iap-2015-growth-sds-calculator.xlsx"))
    g = _cells(z, shared, sheets["IAP15"])
    rows = [r for r in range(4, 200) if isinstance(g.get((r, 1)), float)]
    ages = [round(g[(r, 1)], 4) for r in rows]
    out = {}
    for sex, (cl, cm, cs) in (("boys", (2, 3, 4)), ("girls", (5, 6, 7))):
        out[sex] = [[g[(r, cl)], g[(r, cm)], g[(r, cs)]] for r in rows]
    assert ages[0] == 5.0 and ages[-1] == 18.0, f"unexpected IAP age range {ages[0]}-{ages[-1]}"
    return ages, out


# ------------------------------------------------------------ validate ----
def main():
    report = []

    who_tbl, who_pub, who_out = {}, {}, {}
    for sex in ("boys", "girls"):
        tbl, pub = read_who(sex)
        who_tbl[sex], who_pub[sex] = tbl, pub

        # 1. our LMS maths must reproduce WHO's own published z-score heights
        worst = max(
            abs(lms_x(1, tbl[d][1], tbl[d][2], zt) - pub[d][zt])
            for d in tbl for zt in (-3, -2, -1, 0, 1, 2, 3)
        )
        assert worst < 0.051, f"WHO {sex}: LMS disagrees with published table by {worst:.4f} cm"
        report.append(f"WHO {sex}: max deviation from WHO's own z-score columns {worst:.4f} cm")

        # 2. weekly sampling must not move a z-score enough to matter
        segs = who_knots(tbl)
        worstz = 0.0
        for ks in segs:
            for d in range(ks[0], ks[-1] + 1):
                L, M, S = tbl[d]
                Mi, Si = interp(ks, tbl, d)
                for zt in (-3, -2, -1, 0, 1, 2, 3):
                    worstz = max(worstz, abs(lms_z(1, Mi, Si, lms_x(L, M, S, zt)) - zt))
        assert worstz < 0.01, f"WHO {sex}: weekly sampling shifts z by {worstz:.4f}"
        report.append(f"WHO {sex}: max z shift from weekly sampling {worstz:.5f}")

        who_out[sex] = [
            [[k, round(tbl[k][1], 4), round(tbl[k][2], 5)] for k in ks] for ks in segs
        ]

    iap_ages, iap_lms = read_iap()
    for sex in ("boys", "girls"):
        worst = 0.0
        for i, _ in enumerate(iap_ages):
            L, M, S = iap_lms[sex][i]
            r = [round(L, 5), round(M, 3), round(S, 6)]
            for zt in (-3, -2, -1, 0, 1, 2, 3):
                worst = max(worst, abs(lms_x(L, M, S, zt) - lms_x(*r, zt)))
        assert worst < 0.01, f"IAP {sex}: rounding moves a centile by {worst:.4f} cm"
        report.append(f"IAP {sex}: max centile shift from rounding {worst:.5f} cm")

    iap_out = {
        s: [[round(L, 5), round(M, 3), round(S, 6)] for L, M, S in iap_lms[s]]
        for s in ("boys", "girls")
    }

    # 3. the two references must meet sensibly at the 5-year handover
    for sex in ("boys", "girls"):
        w = who_tbl[sex][1826][1]
        i = iap_out[sex][0][1]
        report.append(f"{sex} median at 5y: WHO {w:.1f} cm, IAP {i:.1f} cm (step {i - w:+.1f})")

    payload = {
        "who": {"switchDay": SWITCH_DAY, "maxDay": MAX_DAY, **who_out},
        "iap": {"ages": iap_ages, **iap_out},
    }

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8", newline="\n") as f:
        f.write(
            "/* AUTO-GENERATED by scripts/build-growth-lms.py. DO NOT EDIT BY HAND.\n"
            " *\n"
            " * Height-for-age LMS parameters.\n"
            " *\n"
            " *   who  WHO Child Growth Standards 2006, length/height-for-age,\n"
            " *        birth to 5 years. Two segments: recumbent length to day 730,\n"
            " *        standing height from day 731. L is 1 throughout, so only M and\n"
            " *        S are stored. Weekly knots; linear interpolation between them\n"
            " *        moves a z-score by at most 0.004.\n"
            " *\n"
            " *   iap  IAP 2015 growth charts, height-for-age, 5 to 18 years, by month.\n"
            " *        Khadilkar V et al. Indian Pediatrics 2015;52:47-55.\n"
            " *        Stored as [L, M, S] at its native monthly resolution.\n"
            " *\n"
            " * Reference tables only. No patient data.\n"
            " */\n\n"
        )
        f.write("export const LMS = ")
        f.write(json.dumps(payload, separators=(",", ":")))
        f.write(" as const;\n")

    print("\n".join("  " + r for r in report))
    print(f"\nwrote {OUT} ({os.path.getsize(OUT) / 1024:.1f} KB)")


if __name__ == "__main__":
    main()
