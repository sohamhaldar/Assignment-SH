'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Button } from './ui/button'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Share2, Copy, Check, Mail, MessageCircle, Link, Download, Image as ImageIcon } from 'lucide-react'
import { useDragDrop } from '@/contexts/DragDropContext'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from './ui/dropdown-menu'



function SharePlan({align = 'end', side = 'bottom', sideOffset = 8}: {
  align?: 'start' | 'center' | 'end'
  side?: 'top' | 'right' | 'bottom' | 'left'
  sideOffset?: number
}) {
  const { columns } = useDragDrop()
  const [copied, setCopied] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [open, setOpen] = useState(false)
  const [openTip, setOpenTip] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)
  const [isTriggerVisible, setIsTriggerVisible] = useState(true)

  


  const getDateRange = () => {
    if (columns.length === 0) return { start: null, end: null }
    
    const dates = columns.map(col => {
      const parts = col.id.split('-')
      if (parts.length === 3) {
        return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]))
      }
      return null
    }).filter(Boolean).sort((a, b) => a!.getTime() - b!.getTime())
    
    return {
      start: dates.length > 0 ? dates[0] : null,
      end: dates.length > 0 ? dates[dates.length - 1] : null
    }
  }

  const formatDateRange = () => {
    const selectedDateRange = getDateRange()
    if (!selectedDateRange.start || !selectedDateRange.end) return 'Weekend'
    
    const start = selectedDateRange.start
    const end = selectedDateRange.end
    
    const startStr = start.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    })
    const endStr = end.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    })
    
    return `${startStr} - ${endStr}`
  }

  const generateShareText = () => {
    const dateRange = formatDateRange()
    let shareText = `🎉 My Weekend Plan: ${dateRange}\n\n`
    
    columns.forEach((column) => {
      if (column.activities.length > 0) {
        shareText += `📅 ${column.title}:\n`
        column.activities.forEach((activity, index) => {
          shareText += `${index + 1}. ${activity.title} (${activity.duration})\n`
          shareText += `   📍 ${activity.location}\n`
        })
        shareText += '\n'
      }
    })
    
    shareText += '✨ Planned with Planify'
    return shareText
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateShareText())
      setCopied(true)
      console.log('Plan copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy to clipboard')
    }
  }

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Weekend Plan: ${formatDateRange()}`)
    const body = encodeURIComponent(generateShareText())
    window.open(`mailto:?subject=${subject}&body=${body}`)
  }

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(generateShareText())
    window.open(`https://wa.me/?text=${text}`)
  }

  const getTotalActivities = () => {
    return columns.reduce((total, column) => total + column.activities.length, 0)
  }

  const generatePosterCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return null

    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    
    let requiredHeight = 300 
    
    columns.forEach((column) => {
      if (column.activities.length > 0) {
        requiredHeight += 80 
        requiredHeight += column.activities.length * 90 
        requiredHeight += 20 
      }
    })

    
    canvas.width = 800
    canvas.height = Math.max(1000, requiredHeight) 

    
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, '#667eea')
    gradient.addColorStop(1, '#764ba2')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = '#ffffff'
    ctx.textAlign = 'center'

    
    ctx.font = 'bold 48px Monospace'
    ctx.fillText('🎉 Weekend Plan', canvas.width / 2, 80)

    ctx.font = '32px Monospace'
    ctx.fillText(formatDateRange(), canvas.width / 2, 140)

    let yPosition = 220
    ctx.textAlign = 'left'
    
    columns.forEach((column) => {
      if (column.activities.length > 0) {
        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 36px Monospace'
        ctx.fillText(`📅 ${column.title}`, 60, yPosition)
        yPosition += 60

        column.activities.forEach((activity, index) => {
          ctx.fillStyle = '#f0f0f0'
          ctx.font = '28px Monospace'
          
          const activityText = `${index + 1}. ${activity.title}`
          const maxWidth = 680 
          
          
          if (ctx.measureText(activityText).width > maxWidth) {
            const words = activityText.split(' ')
            let line = ''
            
            for (const word of words) {
              const testLine = line + word + ' '
              if (ctx.measureText(testLine).width > maxWidth && line !== '') {
                ctx.fillText(line.trim(), 80, yPosition)
                yPosition += 35
                line = word + ' '
              } else {
                line = testLine
              }
            }
            ctx.fillText(line.trim(), 80, yPosition)
          } else {
            ctx.fillText(activityText, 80, yPosition)
          }
          yPosition += 40

          ctx.font = '22px Monospace'
          ctx.fillStyle = '#d0d0d0'
          const detailText = `⏱️ ${activity.duration} • 📍 ${activity.location}`
          
          // Wrap location text if too long
          if (ctx.measureText(detailText).width > 620) {
            const locationText = `📍 ${activity.location}`
            ctx.fillText(`⏱️ ${activity.duration}`, 100, yPosition)
            yPosition += 30
            ctx.fillText(locationText, 100, yPosition)
          } else {
            ctx.fillText(detailText, 100, yPosition)
          }
          yPosition += 50
        })
        yPosition += 20
      }
    })

    ctx.fillStyle = '#ffffff'
    ctx.font = '24px Monospace'
    ctx.textAlign = 'center'
    ctx.fillText('✨ Created with Plannify', canvas.width / 2, canvas.height - 50)

    return canvas
  }

  const downloadPoster = () => {
    const canvas = generatePosterCanvas()
    if (!canvas) return

    const link = document.createElement('a')
    link.download = `weekend-plan-${formatDateRange().replace(/[^a-zA-Z0-9]/g, '-')}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const sharePosterAsImage = async () => {
    const canvas = generatePosterCanvas()
    if (!canvas) return

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return

        if (navigator.share && navigator.canShare) {
          const file = new File([blob], 'weekend-plan.png', { type: 'image/png' })
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: `Weekend Plan: ${formatDateRange()}`,
              text: 'Check out my weekend plan!',
              files: [file]
            })
            return
          }
        }

        if (navigator.clipboard && 'write' in navigator.clipboard) {
          await navigator.clipboard.write([
            new ClipboardItem({
              'image/png': blob
            })
          ])
          console.log('Poster copied to clipboard!')
        }
      }, 'image/png')
    } catch (err) {
      console.error('Failed to share poster:', err)
    }
  }

  useEffect(() => {
    const update = () => {
      const el = triggerRef.current
      setIsTriggerVisible(!!el && el.offsetParent !== null)
    }
    update()
    window.addEventListener('resize', update)
    const onOrientationChange: EventListener = () => update()
    window.addEventListener('orientationchange', onOrientationChange)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', onOrientationChange)
    }
  }, [])

  useEffect(() => {
    if (!isTriggerVisible) return

    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      const typing = tag === 'input' || tag === 'textarea' || target?.isContentEditable;

      if (!open && !typing && e.key.toLowerCase() === 's') {
        e.preventDefault();
        setOpen(true);
        return;
      }

      // if (open) {
      //   if (e.key.toLowerCase() === 'c') {
      //     e.preventDefault();
      //     copyToClipboard();
      //   } else if (e.key.toLowerCase() === 'i') {
      //     e.preventDefault();
      //     void sharePosterAsImage();
      //   } else if (e.key.toLowerCase() === 'd') {
      //     e.preventDefault();
      //     downloadPoster();
      //   } else if (e.key.toLowerCase() === 'e') {
      //     e.preventDefault();
      //     shareViaEmail();
      //   } else if (e.key.toLowerCase() === 'w') {
      //     e.preventDefault();
      //     shareViaWhatsApp();
      //   } else if (e.key === 'Escape') {
      //     e.preventDefault();
      //     setOpen(false);
      //   }
      // }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isTriggerVisible, open]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <Popover open={openTip} onOpenChange={setOpenTip}>
        <PopoverTrigger asChild onMouseEnter={() => setOpenTip(true)} onMouseLeave={() => setOpenTip(false)}>
      <DropdownMenuTrigger asChild>
            <div
              className="flex flex-col items-center justify-center rounded-lg hover:bg-accent p-2 cursor-pointer"
              role="button"
              aria-label="Share plan (S)"
              tabIndex={0}
        ref={triggerRef}
            >
              <Share2 className="w-10 h-10 md:w-8 md:h-8 lg:h-10 lg:w-10 mb-1"/>
              <p className="font-mono text-center text-xs text-medium">Share Plan</p>
            </div>
          </DropdownMenuTrigger>
        </PopoverTrigger>
        <PopoverContent side="top" align="center" className="px-2 py-1 text-xs w-fit font-mono">Share plan (S)</PopoverContent>
      </Popover>
      <DropdownMenuContent className="w-80"
       align={align} side={side} sideOffset={sideOffset}>
        <div className="space-y-4 font-mono p-2">
          <div className="space-y-2">
            <h4 className="font-medium text-sm font-mono">Share Your Weekend Plan</h4>
            <div className="text-xs text-muted-foreground">
              {formatDateRange()} • {getTotalActivities()} activities planned
            </div>
          </div>
          
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2"
              onClick={copyToClipboard}
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2"
              onClick={sharePosterAsImage}
            >
              <ImageIcon className="w-4 h-4" />
              Share as Image
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2"
              onClick={downloadPoster}
            >
              <Download className="w-4 h-4" />
              Download Poster
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2"
              onClick={shareViaEmail}
            >
              <Mail className="w-4 h-4" />
              Share via Email
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2"
              onClick={shareViaWhatsApp}
            >
              <MessageCircle className="w-4 h-4" />
              Share via WhatsApp
            </Button>
          </div>
          
          <div className="pt-2 border-t">
            <div className="text-xs text-muted-foreground">
              Preview:
            </div>
            <div className="mt-1 p-2 bg-muted rounded text-xs max-h-32 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-xs">
                {generateShareText()}
              </pre>
            </div>
          </div>
        </div>
        
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default SharePlan;