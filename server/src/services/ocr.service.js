// server/src/services/ocr.service.js
const Tesseract = require("tesseract.js");

const extractText = async (imageBuffer) => {
  try {
    const {
      data: { text },
    } = await Tesseract.recognize(imageBuffer, "eng", {
      logger: (m) => console.log(m), // Optional: log progress
    });

    return text.trim();
  } catch (error) {
    console.error("OCR extraction failed:", error);
    throw new Error("Failed to extract text from image");
  }
};

const extractMedicationInfo = (text) => {
  const medications = [];
  const lines = text.split("\n").filter((line) => line.trim());

  // Simple regex patterns for medication extraction
  const medicationPatterns = [
    /(\w+)\s+(\d+(?:\.\d+)?)\s*(mg|g|ml|tablets?)\s*(\d+\s*times?\s*(?:daily|per day|a day))?/gi,
    /take\s+(\w+)\s+(\d+(?:\.\d+)?)\s*(mg|g|ml|tablets?)/gi,
  ];

  for (const line of lines) {
    for (const pattern of medicationPatterns) {
      const matches = [...line.matchAll(pattern)];
      for (const match of matches) {
        medications.push({
          name: match[1],
          dosage: `${match[2]} ${match[3]}`,
          frequency: match[4] || "as prescribed",
          instructions: line.trim(),
        });
      }
    }
  }

  return medications;
};

const extractVitalSigns = (text) => {
  const vitals = {};

  // Blood pressure pattern (e.g., 120/80, 140/90)
  const bpPattern = /(\d{2,3})\/(\d{2,3})/g;
  const bpMatch = bpPattern.exec(text);
  if (bpMatch) {
    vitals.bloodPressure = {
      systolic: parseInt(bpMatch[1]),
      diastolic: parseInt(bpMatch[2]),
    };
  }

  // Heart rate pattern
  const hrPattern = /(?:heart rate|pulse|hr)[\s:]*(\d{2,3})/gi;
  const hrMatch = hrPattern.exec(text);
  if (hrMatch) {
    vitals.heartRate = parseInt(hrMatch[1]);
  }

  // Temperature pattern
  const tempPattern = /(?:temp|temperature)[\s:]*(\d{2,3}(?:\.\d)?)/gi;
  const tempMatch = tempPattern.exec(text);
  if (tempMatch) {
    vitals.temperature = parseFloat(tempMatch[1]);
  }

  // Weight pattern
  const weightPattern = /(?:weight|wt)[\s:]*(\d{2,3}(?:\.\d)?)\s*(?:kg|kgs?)/gi;
  const weightMatch = weightPattern.exec(text);
  if (weightMatch) {
    vitals.weight = parseFloat(weightMatch[1]);
  }

  // Blood sugar pattern
  const sugarPattern = /(?:blood sugar|glucose|bs)[\s:]*(\d{2,3})/gi;
  const sugarMatch = sugarPattern.exec(text);
  if (sugarMatch) {
    vitals.bloodSugar = {
      random: parseInt(sugarMatch[1]),
    };
  }

  return vitals;
};

module.exports = {
  extractText,
  extractMedicationInfo,
  extractVitalSigns,
};
