import Document from "../model/Document.js"; // Replace with the actual path to your Document schema
export const getALL = async (req, res) => {
  try {
    const documents = await Document.find({}, "-fileData");
    const totalDoc = await Document.countDocuments();
    res.status(200).json({ documents, totalDoc });
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({
      message: "Failed to fetch documents",
      error: error.message,
    });
  }
};

export const approveDocument = async (req, res) => {
  const documentId = req.params.id;
  console.log(documentId);
  try {
    const document = await Document.findById(documentId);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    document.status = "Approved";

    await document.save();

    res.status(200).json({
      message: "Document approved successfully",
      document,
    });
  } catch (error) {
    console.error("Error approving document:", error);
    res.status(500).json({
      message: "Failed to approve document",
      error: error.message,
    });
  }
};

export const rejectDocument = async (req, res) => {
  const documentId = req.params.id;
  const feedback = req.body.feedback;

  try {
    const document = await Document.findById(documentId);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    document.status = "Rejected";
    document.feedback = feedback;

    await document.save();

    res.status(200).json({
      message: "Document rejected successfully",
      document,
    });
  } catch (error) {
    console.error("Error approving document:", error);
    res.status(500).json({
      message: "Failed to approve document",
      error: error.message,
    });
  }
};

export const previewDocument = async (req, res) => {
  const documentId = req.params.id;

  try {
    const document = await Document.findById(documentId);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (!document.fileData || !document.fileContentType) {
      return res
        .status(400)
        .json({ message: "No file data available for preview." });
    }

    res.set("Content-Type", document.fileContentType);
    res.status(200).send(document.fileData);
  } catch (error) {
    console.error("Error previewing document:", error);
    res.status(500).json({
      message: "Failed to preview document",
      error: error.message,
    });
  }
};

export const downloadDocument = async (req, res) => {
  try {
    const documentId = req.params.id;

    // Find the document by ID
    const document = await Document.findById(documentId);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (!document.fileData || !document.fileContentType) {
      return res
        .status(400)
        .json({ message: "No file data available for download." });
    }

    // Set headers for downloading the file
    res.set({
      "Content-Type": document.fileContentType,
      "Content-Disposition": `attachment; filename="${document.step}"`, // Use the step as the file name
    });

    // Send the file data
    res.status(200).send(document.fileData);
  } catch (error) {
    console.error("Error in downloadDocument:", error);
    res.status(500).json({ message: error.message });
  }
};
