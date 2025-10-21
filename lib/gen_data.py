import json

# Hebrew names and Sefaria transliterations for sedarim and tractates
sedarim_info = [
    ("Zeraim", "זרעים"),
    ("Moed", "מועד"),
    ("Nashim", "נשים"),
    ("Nezikin", "נזיקין"),
    ("Kodashim", "קדשים"),
    ("Tohorot", "טהרות")
]

# Tractates with Hebrew and Sefaria names (English transliterations as keys)
tractates_info = {
    "Zeraim": [
        ("Berakhot", "ברכות"),
        ("Peah", "פאה"),
        ("Demai", "דמאי"),
        ("Kilayim", "כלאים"),
        ("Sheviit", "שביעית"),
        ("Terumot", "תרומות"),
        ("Maaserot", "מעשרות"),
        ("Maaser Sheni", "מעשר שני"),
        ("Challah", "חלה"),
        ("Orlah", "ערלה"),
        ("Bikkurim", "ביכורים")
    ],
    "Moed": [
        ("Shabbat", "שבת"),
        ("Eruvin", "עירובין"),
        ("Pesachim", "פסחים"),
        ("Shekalim", "שקלים"),
        ("Yoma", "יומא"),
        ("Sukkah", "סוכה"),
        ("Beitzah", "ביצה"),
        ("Rosh Hashanah", "ראש השנה"),
        ("Ta'anit", "תענית"),
        ("Megillah", "מגילה"),
        ("Moed Katan", "מועד קטן"),
        ("Chagigah", "חגיגה")
    ],
    "Nashim": [
        ("Yevamot", "יבמות"),
        ("Ketubot", "כתובות"),
        ("Nedarim", "נדרים"),
        ("Nazir", "נזיר"),
        ("Sotah", "סוטה"),
        ("Gitin", "גיטין"),
        ("Kiddushin", "קידושין")
    ],
    "Nezikin": [
        ("Bava Kamma", "בבא קמא"),
        ("Bava Metzia", "בבא מציעא"),
        ("Bava Batra", "בבא בתרא"),
        ("Sanhedrin", "סנהדרין"),
        ("Makkot", "מכות"),
        ("Shevuot", "שבועות"),
        ("Eduyot", "עדויות"),
        ("Avodah Zarah", "עבודה זרה"),
        ("Avot", "אבות"),
        ("Horayot", "הוריות")
    ],
    "Kodashim": [
        ("Zevachim", "זבחים"),
        ("Menachot", "מנחות"),
        ("Chullin", "חולין"),
        ("Bekhorot", "בכורות"),
        ("Arakhin", "ערכין"),
        ("Temurah", "תמורה"),
        ("Keritot", "כריתות"),
        ("Meilah", "מעילה"),
        ("Tamid", "תמיד"),
        ("Middot", "מידות"),
        ("Kinnim", "קינים"),
        ("Kelim", "כלים")
    ],
    "Tohorot": [
        ("Niddah", "נדה"),
        ("Mikvaot", "מקואות"),
        ("Nega'im", "נגעים"),
        ("Parah", "פרה"),
        ("Tahoros", "טהרות"),
        ("Machshirin", "מכשירין"),
        ("Zavim", "זבים"),
        ("Tevul Yom", "טבול יום"),
        ("Yadaim", "ידים"),
        ("Utzkin", "עוזקין"),
        ("Oholot", "אהלות")
    ]
}

# Chapter counts from user data
chapter_counts = {
    # Zeraim
    "Berakhot": [5,8,6,7,5,8,5,8,5],
    "Peah": [6,8,8,11,8,11,8,9],
    "Demai": [4,5,6,7,11,12,8],
    "Kilayim": [9,11,7,9,8,9,8,6,10],
    "Sheviit": [8,10,10,10,9,6,7,11,9,9],
    "Terumot": [10,6,9,13,9,6,7,12,7,12,10],
    "Maaserot": [8,8,10,6,8],
    "Maaser Sheni": [7,10,13,12,15],
    "Challah": [9,8,10,11],
    "Orlah": [9,17,9],
    "Bikkurim": [11,11,12,5],
    # Moed
    "Shabbat": [11,7,6,2,4,10,4,7,7,6,6,6,7,4,3,8,8,3,6,5,3,6,5,5],
    "Eruvin": [10,6,9,11,9,10,11,11,4,15],
    "Pesachim": [7,8,8,9,10,6,13,8,11,9],
    "Shekalim": [7,5,4,9,6,6,7,8],
    "Yoma": [8,7,11,6,7,8,5,9],
    "Sukkah": [11,9,15,10,8],
    "Beitzah": [10,10,8,7,7],
    "Rosh Hashanah": [9,9,8,9],
    "Ta'anit": [7,10,9,8],
    "Megillah": [11,6,6,10],
    "Moed Katan": [10,5,9],
    "Chagigah": [8,7,8],
    # Nashim
    "Yevamot": [4,10,10,13,6,6,6,6,6,9,7,6,13,9,10,7],
    "Ketubot": [10,10,9,12,9,7,10,8,9,6,6,4,11],
    "Nedarim": [4,5,11,8,6,10,9,7,10,8,12],
    "Nazir": [7,10,7,7,7,11,4,2,5],
    "Sotah": [9,6,8,5,5,4,8,7,15],
    "Gitin": [6,7,8,9,9,7,9,10,10],
    "Kiddushin": [10,10,13,14],
    # Nezikin
    "Bava Kamma": [4,6,11,9,7,6,7,7,12,10],
    "Bava Metzia": [8,11,12,12,11,8,11,9,13,6],
    "Bava Batra": [6,14,8,9,11,8,4,8,10,8],
    "Sanhedrin": [6,5,8,5,5,6,11,7,6,6,6],
    "Makkot": [10,8,16],
    "Shevuot": [7,5,11,13,5,7,8,6],
    "Eduyot": [14,10,12,12,7,3,9,7],
    "Avodah Zarah": [9,7,10,12,12],
    "Avot": [18,16,18,22,23,11],
    "Horayot": [5,7,8],
    # Kodashim
    "Zevachim": [4,5,6,6,8,7,6,12,7,8,8,6,8,10],
    "Menachot": [4,5,7,5,9,7,6,7,9,9,9,5,11],
    "Chullin": [7,10,7,7,5,7,6,6,8,4,2,5],
    "Bekhorot": [7,9,4,10,6,12,7,10,8],
    "Arakhin": [4,6,5,4,6,5,5,7,8],
    "Temurah": [6,3,5,4,6,5,6],
    "Keritot": [7,6,10,3,8,9],
    "Meilah": [4,9,8,6,5,6],
    "Tamid": [4,5,9,3,6,3,4],
    "Middot": [9,6,8,7,4],
    "Kinnim": [4,5,6],
    "Kelim": [9,8,8,4,11,4,6,11,8,8,9,8,8,8,6,8,17,9,10,7,3,10,5,17,9,9,12,10,8,4],
    # Tohorot
    "Niddah": [7,7,7,7,9,14,5,4,11,8],
    "Mikvaot": [8,10,4,5,6,11,7,5,7,8],
    "Nega'im": [6,5,8,11,5,8,5,10,3,10,12,7,12,13],
    "Parah": [4,5,11,4,9,5,12,11,9,6,9,11],
    "Tahoros": [9,8,8,13,9,10,9,9,9,8],
    "Machshirin": [6,11,8,10,11,8],
    "Zavim": [6,4,3,7,12],
    "Tevul Yom": [5,8,6,7],
    "Yadaim": [5,4,5,8],
    "Utzkin": [6,10,12],
    "Oholot": [8,7,7,3,7,7,6,6,16,7,9,8,6,7,10,5,5,10]
}

# Generate JSON structure
final_json = {}

for s_idx, (seder_eng, seder_heb) in enumerate(sedarim_info, 1):
    seder_obj = {
        "metadata": {"order": s_idx, "hebrewName": seder_heb, "safariaName": seder_eng},
        "tractates": {}
    }
    for t_idx, (tract_eng, tract_heb) in enumerate(tractates_info[seder_eng], 1):
        chapters_obj = {}
        counts = chapter_counts.get(tract_eng, [])
        for ch_num, num_m in enumerate(counts, 1):
            chapters_obj[ch_num] = {"hebrewName": f"פרק {ch_num}", "numberOfMishnayot": num_m}
        seder_obj["tractates"][tract_eng] = {
            "metadata": {"order": t_idx, "hebrewName": tract_heb, "safariaName": tract_eng},
            "chapters": chapters_obj
        }
    final_json[seder_eng] = seder_obj

# Write to file
output_path = "mishnah_full.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(final_json, f, ensure_ascii=False, indent=2)
print(f"Generated {output_path} successfully.")
