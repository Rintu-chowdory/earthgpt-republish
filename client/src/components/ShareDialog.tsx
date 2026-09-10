import React, { useEffect, useMemo, useState } from "react";
import { Check, Copy, Facebook, Linkedin, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  text: string;
  url?: string;
}

export const ShareDialog: React.FC<ShareDialogProps> = ({
  open,
  onOpenChange,
  title,
  text,
  url,
}) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = useMemo(
    () => url || (typeof window !== "undefined" ? window.location.href : ""),
    [url]
  );
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(text);

  useEffect(() => {
    if (!open) setCopied(false);
  }, [open]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  const nativeShare = async () => {
    if (!navigator.share) return;
    await navigator.share({ title, text, url: shareUrl });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-slate-700 bg-slate-950 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Share2 className="h-5 w-5 text-blue-400" />
            Share {title}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Share this EarthGPT view or answer with your network.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="rounded-lg border border-slate-700 bg-slate-900/80 p-3 text-sm text-slate-300">
            {text}
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Button
              variant="outline"
              className="border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
              onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`, "_blank", "noopener,noreferrer")}
            >
              <span className="font-bold">𝕏</span> X
            </Button>
            <Button
              variant="outline"
              className="border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
              onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, "_blank", "noopener,noreferrer")}
            >
              <Facebook className="h-4 w-4 text-blue-400" /> Facebook
            </Button>
            <Button
              variant="outline"
              className="border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
              onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, "_blank", "noopener,noreferrer")}
            >
              <Linkedin className="h-4 w-4 text-sky-400" /> LinkedIn
            </Button>
            <Button
              variant="outline"
              className="border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
              onClick={() => window.open(`https://wa.me/?text=${encodedText}%20${encodedUrl}`, "_blank", "noopener,noreferrer")}
            >
              <MessageCircle className="h-4 w-4 text-emerald-400" /> WhatsApp
            </Button>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={copyLink}
            >
              {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              {copied ? "Link copied" : "Copy link"}
            </Button>
            {typeof navigator !== "undefined" && "share" in navigator && (
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={nativeShare}>
                <Share2 className="h-4 w-4" /> More options
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
