export interface MishnaProgress {
  completedChapters: Set<number> // Set of chapter indices
  lastStudyDate: string | null
  currentStreak: number
  longestStreak: number
  startDate: string
}

const STORAGE_KEY = "mishna-progress"

export function loadProgress(): MishnaProgress {
  if (typeof window === "undefined") {
    return getDefaultProgress()
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return getDefaultProgress()
    }

    const parsed = JSON.parse(stored)
    return {
      ...parsed,
      completedChapters: new Set(parsed.completedChapters || []),
    }
  } catch {
    return getDefaultProgress()
  }
}

export function saveProgress(progress: MishnaProgress): void {
  if (typeof window === "undefined") return

  try {
    const toStore = {
      ...progress,
      completedChapters: Array.from(progress.completedChapters),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore))
  } catch (error) {
    console.error("Failed to save progress:", error)
  }
}

export function toggleChapter(chapterIndex: number): MishnaProgress {
  const progress = loadProgress()

  if (progress.completedChapters.has(chapterIndex)) {
    progress.completedChapters.delete(chapterIndex)
  } else {
    progress.completedChapters.add(chapterIndex)

    // Update streak if studying today
    const today = new Date().toISOString().split("T")[0]
    if (progress.lastStudyDate !== today) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split("T")[0]

      if (progress.lastStudyDate === yesterdayStr) {
        progress.currentStreak += 1
      } else {
        progress.currentStreak = 1
      }

      progress.lastStudyDate = today
      progress.longestStreak = Math.max(progress.longestStreak, progress.currentStreak)
    }
  }

  saveProgress(progress)
  return progress
}

function getDefaultProgress(): MishnaProgress {
  return {
    completedChapters: new Set(),
    lastStudyDate: null,
    currentStreak: 0,
    longestStreak: 0,
    startDate: new Date().toISOString().split("T")[0],
  }
}

export function resetProgress(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(STORAGE_KEY)
}
