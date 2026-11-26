import { Button } from '#/components/ui/button';
import { Label } from '#/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '#/components/ui/select';
import { Slider } from '#/components/ui/slider';
import { Textarea } from '#/components/ui/textarea';
import { LAYOUT_OPTIONS, SLIDE_STYLES, TONE_OPTIONS } from '#/features/presentation/constant/presentation-option';
import { PRESENTATION_TEMPLATES } from '#/features/presentation/constant/presentation-template';
import { getSession } from '#/lib/auth.functions'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { Wand2 } from 'lucide-react';
import { useState } from 'react';

type HomeFormState = {
  content: string;
  slideCount: number;
  style: (typeof SLIDE_STYLES)[number]['value'];
  tone: (typeof TONE_OPTIONS)[number]['value'];
  layout: (typeof LAYOUT_OPTIONS)[number]['value'];
}

export const Route = createFileRoute('/')({
  beforeLoad: async ({ location }) => {
    const session = await getSession();

    if (!session) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href }
      })
    }

    return { user: session.user }
  },
  component: Home
})

function Home() {

  const [form, setForm] = useState<HomeFormState>({
    content: '',
    slideCount: 8,
    style: 'minimal',
    tone: 'formal',
    layout: 'balanced',
  })

  return (
    <main className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 mt-10">
            What do you want to{' '}
            <span className="text-gradient-peach">create?</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Enter your content and we'll generate a beautiful presentation
          </p>
        </div>

        <div className="glass rounded-3xl p-6 md:p-8 space-y-6">
          <div className="space-y-2">
            <Textarea
              placeholder="Describe your presentation topic, paste your notes, or outline your key points..."
              value={form.content}
              onChange={(e) =>
                setForm((s) => ({
                  ...s,
                  content: e.target.value,
                }))
              }
              className="h-50 min-h-50 max-h-50 overflow-y-auto text-base bg-background/50 border-border/50 
              rounded-2xl resize-none focus-visible:ring-primary/30"
            />
            <div className="flex justify-between text-xs text-muted-foreground px-1">
              <span>{form.content.length.toLocaleString()} characters</span>
              <span>Markdown supported</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Slide count */}
            <div className="space-y-2.5">
              <Label className="text-sm font-medium">
                Slides: {form.slideCount}
              </Label>
              <Slider
                value={[form.slideCount]}
                onValueChange={(value) =>
                  setForm((s) => ({
                    ...s,
                    slideCount:
                      typeof value === 'number'
                        ? value
                        : (value[0] ?? s.slideCount),
                  }))
                }
                min={3}
                max={20}
                step={1}
                className="py-2"
              />
            </div>

            {/* Style */}
            <div className="space-y-2.5">
              <Label className="text-sm font-medium">Style</Label>
              <Select
                value={form.style}
                onValueChange={(value) =>
                  setForm((s) => ({
                    ...s,
                    style: value as HomeFormState['style'],
                  }))
                }
              >
                <SelectTrigger className="bg-background/50 border-border/50 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass">
                  {SLIDE_STYLES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tone */}
            <div className="space-y-2.5">
              <Label className="text-sm font-medium">Tone</Label>
              <Select
                value={form.tone}
                onValueChange={(value) =>
                  setForm((s) => ({
                    ...s,
                    tone: value as HomeFormState['tone'],
                  }))
                }
              >
                <SelectTrigger className="bg-background/50 border-border/50 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass">
                  {TONE_OPTIONS.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Layout */}
            <div className="space-y-2.5">
              <Label className="text-sm font-medium">Layout</Label>
              <Select
                value={form.layout}
                onValueChange={(value) =>
                  setForm((s) => ({
                    ...s,
                    layout: value as HomeFormState['layout'],
                  }))
                }
              >
                <SelectTrigger className="bg-background/50 border-border/50 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass">
                  {LAYOUT_OPTIONS.map((l) => (
                    <SelectItem key={l.value} value={l.value}>
                      {l.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className='flex justify-end pt-2'>
            <Button size="lg" className="rounded-xl px-6 py-5 gap-2 font-semibold">
              <Wand2 className="size-4" />
              Generate PPT
            </Button>
          </div>
        </div>

        <div className="mt-8">
          <p className="text-center text-sm text-muted-foreground mb-3">
            Try a template
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {PRESENTATION_TEMPLATES.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => {
                  setForm({
                    content: template.content,
                    slideCount: template.slides,
                    style: template.style,
                    tone: template.tone,
                    layout: template.layout,
                  })
                }}
                className="px-4 py-2 text-sm rounded-full border border-border/50 bg-card/50 text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all"
              >
                {template.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
