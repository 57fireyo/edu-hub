/**
 * PDF Helper for EduHub
 * Provides reliable, cross-browser PDF upload, new-tab preview, and download.
 */

export interface UploadedPdfResult {
  url: string;
  downloadUrl: string;
  fileName: string;
  fileSize: string;
  dataUrl?: string;
}

/**
 * Converts a base64 Data URL to a Blob
 */
export function dataUrlToBlob(dataUrl: string): Blob {
  const parts = dataUrl.split(',');
  const mimeMatch = parts[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'application/pdf';
  const bstr = atob(parts[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * Uploads a PDF file to the backend server and stores local fallback
 */
export async function uploadPdfToServer(file: File): Promise<UploadedPdfResult> {
  const fileName = file.name || 'document.pdf';
  const fileSizeMb = (file.size / (1024 * 1024)).toFixed(2);
  const fileSize = `${fileSizeMb} MB`;

  // Read as Data URL
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });

  try {
    const response = await fetch('/api/resources/upload-file', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName,
        fileBase64: dataUrl,
        fileSize,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success && result.url) {
        return {
          url: result.url,
          downloadUrl: result.downloadUrl || `${result.url}?download=true`,
          fileName: result.fileName || fileName,
          fileSize: result.fileSize || fileSize,
          dataUrl,
        };
      }
    }
  } catch (err) {
    console.warn('Backend PDF upload endpoint unavailable, using local client storage:', err);
  }

  // Fallback: Use client-side Blob URL
  const blob = dataUrlToBlob(dataUrl);
  const blobUrl = URL.createObjectURL(blob);

  return {
    url: blobUrl,
    downloadUrl: blobUrl,
    fileName,
    fileSize,
    dataUrl,
  };
}

/**
 * Opens a PDF in a new browser tab for review and preview without CORS or data-URL errors.
 */
export function openPdfInNewTab(url: string, fileName?: string): void {
  if (!url) {
    window.open('/dsa-all-practicals.pdf', '_blank', 'noopener,noreferrer');
    return;
  }

  // Handle data URL by creating a Blob URL first (browsers block top-level data: navigation)
  if (url.startsWith('data:')) {
    try {
      const blob = dataUrlToBlob(url);
      const blobUrl = URL.createObjectURL(blob);
      const newTab = window.open(blobUrl, '_blank', 'noopener,noreferrer');
      if (!newTab) {
        // Fallback if popup blocked
        window.location.href = blobUrl;
      }
      return;
    } catch (e) {
      console.error('Error opening base64 PDF:', e);
    }
  }

  // Handle relative or regular HTTP URLs
  const targetUrl = url.includes('slosofqdfxelmonorspt')
    ? '/dsa-all-practicals.pdf'
    : url;

  window.open(targetUrl, '_blank', 'noopener,noreferrer');
}

/**
 * Downloads a PDF file with proper filename
 */
export async function downloadPdfFile(url: string, suggestedFileName?: string): Promise<void> {
  const safeName = (suggestedFileName || 'academic-document.pdf').endsWith('.pdf')
    ? (suggestedFileName || 'academic-document.pdf')
    : `${suggestedFileName || 'academic-document'}.pdf`;

  const targetUrl = !url || url.includes('slosofqdfxelmonorspt')
    ? '/dsa-all-practicals.pdf'
    : url;

  // If it's a data URL or blob URL, download directly via <a> tag
  if (targetUrl.startsWith('data:') || targetUrl.startsWith('blob:')) {
    const a = document.createElement('a');
    a.href = targetUrl;
    a.download = safeName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return;
  }

  // Fetch as blob for exact file naming on same-origin or CORS-enabled endpoints
  try {
    const res = await fetch(targetUrl);
    if (res.ok) {
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = safeName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(objectUrl), 60000);
      return;
    }
  } catch (err) {
    console.warn('Direct blob download failed, falling back to window.open:', err);
  }

  // Fallback: direct anchor with download attribute or new tab
  const finalHref = targetUrl.startsWith('/api/resources/file/') && !targetUrl.includes('download=true')
    ? `${targetUrl}${targetUrl.includes('?') ? '&' : '?'}download=true`
    : targetUrl;

  const a = document.createElement('a');
  a.href = finalHref;
  a.download = safeName;
  a.target = '_blank';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
