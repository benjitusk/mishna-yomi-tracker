"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ExternalLink, BookOpen } from "lucide-react"
import { fetchMishnaText, getSefariaUrl, type SefariaText } from "@/lib/sefaria-api"
import type { Seder } from "@/lib/mishna-data"

interface MishnaTextDialogProps {
  seder: Seder
  tractate: string
  chapter: number
  children: React.ReactNode
}

export function MishnaTextDialog({ seder, tractate, chapter, children }: MishnaTextDialogProps) {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState<SefariaText | null>(null)
  const [loading, setLoading] = useState(false)
  const [showHebrew, setShowHebrew] = useState(true)

  useEffect(() => {
    if (open && !text) {
      setLoading(true)
      fetchMishnaText(tractate, chapter)
        .then((data) => {
          setText(data)
          setLoading(false)
        })
        .catch(() => {
          setLoading(false)
        })
    }
  }, [open, text, tractate, chapter])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-2xl">
                {tractate} {chapter}
              </DialogTitle>
              <DialogDescription className="mt-1">
                <Badge variant="secondary" className="text-xs">
                  {seder}
                </Badge>
              </DialogDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowHebrew(!showHebrew)}>
                {showHebrew ? "English" : "Hebrew"}
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href={getSefariaUrl(tractate, chapter)} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Sefaria
                </a>
              </Button>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[60vh] pr-4">
          {loading && (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              ))}
            </div>
          )}

          {!loading && !text && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Failed to load Mishna text</p>
              <p className="text-sm text-muted-foreground mt-2">Please try again or visit Sefaria directly</p>
            </div>
          )}

          {!loading && text && (
            <div className="space-y-6">
              {showHebrew ? (
                <div className="space-y-4" dir="rtl">
                  {text.he.map((mishna, index) => (
                    <div key={index} className="pb-4 border-b last:border-0">
                      <div className="flex gap-3">
                        <Badge variant="outline" className="shrink-0 h-6">
                          {index + 1}
                        </Badge>
                        <p className="text-base leading-relaxed font-serif" lang="he">
                          {mishna}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {text.text.map((mishna, index) => (
                    <div key={index} className="pb-4 border-b last:border-0">
                      <div className="flex gap-3">
                        <Badge variant="outline" className="shrink-0 h-6">
                          {index + 1}
                        </Badge>
                        <p className="text-base leading-relaxed">{mishna}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
