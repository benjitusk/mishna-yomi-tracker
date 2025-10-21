"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { getAllTractates, getChapterIndex, type Seder } from "@/lib/mishna-data"

interface AllTractatesViewProps {
  completedChapters: Set<number>
  onChapterClick: (index: number) => void
}

const SEDER_COLORS: Record<Seder, string> = {
  Zeraim: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  Moed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  Nashim: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  Nezikin: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  Kodashim: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  Tahorot: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
}

export function AllTractatesView({ completedChapters, onChapterClick }: AllTractatesViewProps) {
  const tractates = getAllTractates()

  // Group by Seder
  const tractatesBySeder = tractates.reduce(
    (acc, tractate) => {
      if (!acc[tractate.seder]) {
        acc[tractate.seder] = []
      }
      acc[tractate.seder].push(tractate)
      return acc
    },
    {} as Record<Seder, typeof tractates>,
  )

  return (
    <div className="space-y-8">
      {Object.entries(tractatesBySeder).map(([seder, tractateList]) => {
        const totalChapters = tractateList.reduce((sum, t) => sum + t.chapters, 0)
        const completedInSeder = tractateList.reduce((sum, t) => {
          let completed = 0
          for (let i = 1; i <= t.chapters; i++) {
            const index = getChapterIndex(t.tractate, i)
            if (completedChapters.has(index)) completed++
          }
          return sum + completed
        }, 0)
        const progressPercent = (completedInSeder / totalChapters) * 100

        return (
          <section key={seder}>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold">{seder}</h2>
                <Badge className={SEDER_COLORS[seder as Seder]} variant="secondary">
                  {completedInSeder} / {totalChapters}
                </Badge>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tractateList.map((tractate) => {
                const completedCount = Array.from({ length: tractate.chapters }, (_, i) => {
                  const index = getChapterIndex(tractate.tractate, i + 1)
                  return completedChapters.has(index)
                }).filter(Boolean).length

                return (
                  <Card key={tractate.tractate} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">{tractate.tractate}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">{tractate.chapters} chapters</span>
                        <span className="font-medium">
                          {completedCount} / {tractate.chapters}
                        </span>
                      </div>
                      <Progress value={(completedCount / tractate.chapters) * 100} className="h-1.5" />
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}
