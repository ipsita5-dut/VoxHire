export async function extractTextFromFile(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());

  // 📄 PDF handling
  if (file.name.toLowerCase().endsWith(".pdf")) {
    const pdfParse = (await import("pdf-parse")).default; // dynamic import
    const data = await pdfParse(buffer);
    return data.text;
  }

  // 📄 DOCX handling
  if (file.name.toLowerCase().endsWith(".docx")) {
    const mammoth = (await import("mammoth")).default; // dynamic import
    const { value } = await mammoth.extractRawText({ buffer });
    return value;
  }

  // 📄 TXT handling
  if (file.name.toLowerCase().endsWith(".txt")) {
    return buffer.toString("utf-8");
  }

  throw new Error("Unsupported file format");
}
