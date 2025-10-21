export interface SefariaText {
  text: string[]
  he: string[]
  ref: string
  heRef: string
  sections: number[]
  toSections: number[]
}

export interface SefariaTextResponse {
  text: string | string[]
  he: string | string[]
  ref: string
  heRef: string
  sections: number[]
  toSections: number[]
  sectionNames: string[]
  addressTypes: string[]
}

// Convert tractate name to Sefaria format
function formatTractateForSefaria(tractate: string): string {
  // Sefaria uses specific formatting for tractate names
  const tractateMap: Record<string, string> = {
    "Maaser Sheni": "Maaser_Sheni",
    "Rosh Hashanah": "Rosh_Hashanah",
    "Moed Katan": "Moed_Katan",
    "Bava Kamma": "Bava_Kamma",
    "Bava Metzia": "Bava_Metzia",
    "Bava Batra": "Bava_Batra",
    "Avodah Zarah": "Avodah_Zarah",
    "Tevul Yom": "Tevul_Yom",
  }

  return tractateMap[tractate] || tractate.replace(/\s+/g, "_")
}

export async function fetchMishnaText(tractate: string, chapter: number): Promise<SefariaText | null> {
  try {
    const formattedTractate = formatTractateForSefaria(tractate)
    const url = `https://www.sefaria.org/api/texts/Mishnah_${formattedTractate}.${chapter}?context=0`

    const response = await fetch(url)

    if (!response.ok) {
      console.error(`Failed to fetch Mishna text: ${response.status}`)
      return null
    }

    const data: SefariaTextResponse = await response.json()

    // Normalize the response - sometimes text is a string, sometimes an array
    const text = Array.isArray(data.text) ? data.text : [data.text]
    const he = Array.isArray(data.he) ? data.he : [data.he]

    return {
      text,
      he,
      ref: data.ref,
      heRef: data.heRef,
      sections: data.sections,
      toSections: data.toSections,
    }
  } catch (error) {
    console.error("Error fetching Mishna text:", error)
    return null
  }
}

export function getSefariaUrl(tractate: string, chapter: number): string {
  const formattedTractate = formatTractateForSefaria(tractate)
  return `https://www.sefaria.org/Mishnah_${formattedTractate}.${chapter}`
}
