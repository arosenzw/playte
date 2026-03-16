import { toBlob } from "html-to-image";

export async function pregenerateBlob(element: HTMLElement): Promise<Blob | null> {
  // First pass warms up html-to-image's image cache
  await toBlob(element, { pixelRatio: 2 });
  return toBlob(element, { pixelRatio: 2 });
}

export async function shareBlob(blob: Blob, filename: string) {
  const file = new File([blob], filename, { type: "image/png" });
  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({ files: [file], title: "playte" });
  } else {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
}
