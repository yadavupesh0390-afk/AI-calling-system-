import React, { useState } from "react";
import { campaignService } from "../services/api";

const CreateCampaign = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [useAutoCampaign, setUseAutoCampaign] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      let campaignId = null;

      // 🟢 CASE 1: Manual Campaign Create
      if (!useAutoCampaign) {
        const res = await campaignService.createCampaign({
          name,
          description,
        });

        campaignId = res.data.campaign._id;
      }

      // 🔵 CASE 2: Auto Campaign (backend will handle)
      // campaignId remains null → backend will create default campaign

      // 📤 Upload file (always allowed)
      if (file) {
        await campaignService.uploadPhoneNumbers(campaignId, file);
      }

      alert("Campaign & Leads Uploaded Successfully 🚀");

      // reset
      setName("");
      setDescription("");
      setFile(null);

    } catch (err) {
      console.log(err);
      alert("Error creating campaign");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white">

      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl w-[420px] shadow-xl"
      >

        <h2 className="text-2xl font-bold mb-5 text-center">
          Create Campaign 🚀
        </h2>

        {/* Auto Campaign Toggle */}
        <label className="flex items-center gap-2 mb-4 text-sm">
          <input
            type="checkbox"
            checked={useAutoCampaign}
            onChange={() => setUseAutoCampaign(!useAutoCampaign)}
          />
          Use Auto Campaign (no need to fill details)
        </label>

        {/* Campaign Name */}
        {!useAutoCampaign && (
          <>
            <input
              className="w-full p-2 mb-3 text-black rounded"
              placeholder="Campaign Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <textarea
              className="w-full p-2 mb-3 text-black rounded"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </>
        )}

        {/* File Upload */}
        <input
          type="file"
          accept=".csv,.xlsx"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-4"
        />

        {/* Info Box */}
        <div className="text-xs text-gray-300 mb-3">
          📌 Upload Excel/CSV with phone numbers only<br />
          📌 System will auto-start AI calling after upload
        </div>

        {/* Submit Button */}
        <button
          className="bg-gradient-to-r from-blue-500 to-purple-600 w-full p-2 rounded font-bold hover:scale-105 transition"
          disabled={loading}
        >
          {loading
            ? "Processing..."
            : useAutoCampaign
            ? "Upload & Start Calling"
            : "Create Campaign & Upload"}
        </button>

      </form>
    </div>
  );
};

export default CreateCampaign;
