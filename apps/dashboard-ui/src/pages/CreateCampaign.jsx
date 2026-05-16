import React, { useState } from "react";
import { campaignService } from "../services/api";
import { useNavigate } from "react-router-dom";

const CreateCampaign = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [useAutoCampaign, setUseAutoCampaign] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔥 VALIDATION
    if (!file) {
      alert("Please upload CSV or Excel file");
      return;
    }

    try {
      setLoading(true);

      let campaignId = null;

      // 🟢 CREATE CAMPAIGN ONLY IF MANUAL
      if (!useAutoCampaign) {
        const res = await campaignService.createCampaign({
          name: name || "Manual Campaign",
          description: description || "Created from UI",
        });

        campaignId = res?.data?.campaign?._id;

        if (!campaignId) {
          throw new Error("Campaign ID not received");
        }
      }

      // 🟡 AUTO MODE FIX (IMPORTANT)
      // if campaignId is null → backend MUST support auto-campaign
      // otherwise fallback create
      if (!campaignId) {
        const res = await campaignService.createCampaign({
          name: "Auto Campaign",
          description: "Auto generated",
        });

        campaignId = res?.data?.campaign?._id;
      }

      // 📤 UPLOAD LEADS
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await campaignService.uploadPhoneNumbers(
        campaignId,
        file
      );

      alert(
        `🚀 Success!\nCampaign Ready & ${uploadRes.data.message}`
      );

      // RESET
      setName("");
      setDescription("");
      setFile(null);

      // 🔥 GO TO CAMPAIGNS
      navigate("/campaigns");

    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.error ||
        err.message ||
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-4">

      <form
        onSubmit={handleSubmit}
        className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl w-[420px] shadow-2xl"
      >

        <h2 className="text-2xl font-bold mb-6 text-center">
          🚀 Create Campaign
        </h2>

        {/* AUTO MODE */}
        <label className="flex items-center gap-2 mb-4 text-sm text-gray-300">
          <input
            type="checkbox"
            checked={useAutoCampaign}
            onChange={() => setUseAutoCampaign(!useAutoCampaign)}
          />
          Use Auto Campaign (system handles everything)
        </label>

        {/* NAME + DESCRIPTION */}
        {!useAutoCampaign && (
          <>
            <input
              className="w-full p-3 mb-3 rounded bg-white/10 text-white"
              placeholder="Campaign Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <textarea
              className="w-full p-3 mb-3 rounded bg-white/10 text-white"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </>
        )}

        {/* FILE UPLOAD */}
        <input
          type="file"
          accept=".csv,.xlsx"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full mb-4 text-sm"
        />

        {/* INFO */}
        <div className="text-xs text-gray-400 mb-4">
          📌 CSV/Excel must contain phone numbers only<br />
          📌 System will automatically start calling after upload
        </div>

        {/* BUTTON */}
        <button
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl font-bold hover:scale-105 transition"
        >
          {loading ? "Processing..." : "Create & Start Calling"}
        </button>

      </form>
    </div>
  );
};

export default CreateCampaign;
