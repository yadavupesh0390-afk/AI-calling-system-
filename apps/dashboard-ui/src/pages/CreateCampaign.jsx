import React, { useState } from "react";
import { campaignService } from "../services/api";

const CreateCampaign = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // 1. Campaign create
      const res = await campaignService.createCampaign({
        name,
        description,
      });

      const campaignId = res.data.campaign._id;

      // 2. File upload (numbers)
      if (file) {
        await campaignService.uploadPhoneNumbers(campaignId, file);
      }

      alert("Campaign Created Successfully!");
    } catch (err) {
      console.log(err);
      alert("Error creating campaign");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 p-6 rounded-xl w-[400px]"
      >
        <h2 className="text-2xl mb-4">Create Campaign</h2>

        <input
          className="w-full p-2 mb-3 text-black"
          placeholder="Campaign Name"
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          className="w-full p-2 mb-3 text-black"
          placeholder="Description"
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="file"
          accept=".csv,.xlsx"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-3"
        />

        <button
          className="bg-blue-500 w-full p-2"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Campaign"}
        </button>
      </form>
    </div>
  );
};

export default CreateCampaign;
