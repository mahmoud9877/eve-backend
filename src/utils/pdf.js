import pdfjsLib from "pdfjs-dist/legacy/build/pdf.js";

/**
 * استخراج النص من ملف PDF باستخدام pdfjs-dist
 * @param {Buffer} buffer - محتوى ملف PDF
 * @param {Object} options - إعدادات إضافية
 * @param {number} options.max - الحد الأقصى لعدد الصفحات
 * @param {number} options.startPage - أول صفحة للقراءة
 * @param {number} options.endPage - آخر صفحة للقراءة
 * @returns {Promise<{ text: string, numpages: number, numrender: number }>}
 */
export async function extractTextFromPDF(buffer, options = {}) {
  const result = {
    text: "",
    numpages: 0,
    numrender: 0,
  };

  const pagerender = options.pagerender || defaultRenderPage;
  const maxPages = options.max || 0;
  const startPage = options.startPage || 1;
  const endPage = options.endPage || 0;

  const data = new Uint8Array(buffer);
  const loadingTask = pdfjsLib.getDocument({ data });
  const doc = await loadingTask.promise;
  result.numpages = doc.numPages;

  const pagesToRead = Math.min(
    endPage || doc.numPages,
    maxPages ? Math.min(startPage + maxPages - 1, doc.numPages) : doc.numPages
  );

  const textParts = [];

  for (let i = startPage; i <= pagesToRead; i++) {
    try {
      const page = await doc.getPage(i);
      const text = await pagerender(page);
      textParts.push(`\n\n--- Page ${i} ---\n${text}`);
      result.numrender++;
    } catch (err) {
      console.warn(`❌ Failed to read page ${i}:`, err.message);
    }
  }

  doc.cleanup();
  result.text = textParts.join("\n");
  return result;
}

// الدالة الافتراضية لمعالجة كل صفحة
function defaultRenderPage(pageData) {
  const options = {
    normalizeWhitespace: true,
    disableCombineTextItems: false,
  };

  return pageData.getTextContent(options).then((textContent) => {
    let lastY = null;
    let text = "";

    for (const item of textContent.items) {
      const thisY = item.transform[5];
      const str = item.str;

      if (!str.trim()) continue;

      if (lastY === thisY || lastY === null) {
        text += str + " ";
      } else {
        text += "\n" + str + " ";
      }

      lastY = thisY;
    }
    return text.trim();
  });
}

// import pdfjsLib from "pdfjs-dist/legacy/build/pdf.js";
// /**
//  * استخراج النص من ملف PDF باستخدام pdfjs-dist
//  * @param {Buffer} buffer - محتوى ملف PDF
//  * @param {Object} options - إعدادات إضافية
//  * @param {number} options.max - عدد الصفحات القصوى (افتراضي: الكل)
//  * @returns {Promise<{ text: string, numpages: number, numrender: number }>}
//  */
// export async function extractTextFromPDF(buffer, options = {}) {
//   const ret = {
//     text: "",
//     numpages: 0,
//     numrender: 0,
//   };

//   const pagerender = options.pagerender || defaultRenderPage;
//   const maxPages = options.max || 0;

//   // تحميل الملف
//   const data = new Uint8Array(buffer); // بدل buffer بـ data
//   const loadingTask = pdfjsLib.getDocument({ data });
//   const doc = await loadingTask.promise;
//   ret.numpages = doc.numPages;

//   const count = maxPages > 0 ? Math.min(maxPages, doc.numPages) : doc.numPages;

//   for (let i = 1; i <= count; i++) {
//     try {
//       const page = await doc.getPage(i);
//       const text = await pagerender(page);
//       ret.text += `\n\n${text}`; // ✅ كانت دي فيها خطأ
//     } catch (err) {
//       console.warn(`❌ فشل في قراءة الصفحة ${i}:`, err.message); // ✅ دي كمان
//     }
//   }

//   ret.numrender = count;
//   doc.cleanup();

//   return ret;
// }

// // دالة افتراضية لمعالجة كل صفحة
// function defaultRenderPage(pageData) {
//   const options = {
//     normalizeWhitespace: false,
//     disableCombineTextItems: false,
//   };

//   return pageData.getTextContent(options).then((textContent) => {
//     let lastY;
//     let text = "";

//     for (const item of textContent.items) {
//       if (lastY === item.transform[5] || !lastY) {
//         text += item.str;
//       } else {
//         text += "\n" + item.str;
//       }
//       lastY = item.transform[5];
//     }

//     return text;
//   });
// }


