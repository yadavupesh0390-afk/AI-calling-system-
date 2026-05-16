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

    if (!file) {
      alert("Please upload CSV or Excel file");
      return;
    }

    try {
      setLoading(true);

      let campaignId;

      // 1️⃣ CREATE CAMPAIGN
      const res = await campaignService.createCampaign({
        name: name || (useAutoCampaign ? "Auto Campaign" : "Manual Campaign"),
        description: description || "Created from UI",
      });

      campaignId = res?.data?.campaign?._id;

      if (!campaignId) throw new Error("Campaign ID missing");

      console.log("✅ Campaign Created:", campaignId);

      // 2️⃣ UPLOAD LEADS
      await campaignService.uploadPhoneNumbers(campaignId, file);

      console.log("📤 Leads uploaded");

      // 3️⃣ IMPORTANT 🔥 START CALLING
      await campaignService.startCampaign(campaignId);

      console.log("📞 Campaign Started (CALLING ACTIVE)");

      alert("🚀 Campaign Created + Upload Done + Calling Started!");

      setName("");
      setDescription("");
      setFile(null);

      navigate("/campaigns");

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || err.message || "Error occurred");
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

        <label className="flex items-center gap-2 mb-4 text-sm text-gray-300">
          <input
            type="checkbox"
            checked={useAutoCampaign}
            onChange={() => setUseAutoCampaign(!useAutoCampaign)}
          />
          Auto Mode
        </label>

        {!useAutoCampaign && (
          <>
            <input
              className="w-full p-3 mb-3 rounded bg-white/10"
              placeholder="Campaign Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <textarea
              className="w-full p-3 mb-3 rounded bg-white/10"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </>
        )}

        <input
          type="file"
          accept=".csv,.xlsx"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full mb-4"
        />

        <button
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl font-bold"
        >
          {loading ? "Processing..." : "Create & Start Calling"}
        </button>
      </form>
    </div>
  );
};

export default CreateCampaign;
