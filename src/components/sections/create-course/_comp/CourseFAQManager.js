"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Save, X } from "lucide-react";
import useSweetAlert from "@/hooks/useSweetAlert";

const CourseFAQManager = ({ courseId }) => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newFaq, setNewFaq] = useState({ question: "", answer: "" });
  const showAlert = useSweetAlert();

  useEffect(() => {
    if (courseId) {
      fetchFAQs();
    }
  }, [courseId]);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/courses/${courseId}/faqs`);
      if (response.ok) {
        const data = await response.json();
        setFaqs(data.faqs || []);
      }
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFAQ = async () => {
    if (!newFaq.question.trim() || !newFaq.answer.trim()) {
      showAlert("error", "Please fill in both question and answer");
      return;
    }

    try {
      const response = await fetch(`/api/courses/${courseId}/faqs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newFaq)
      });

      if (response.ok) {
        await fetchFAQs();
        setNewFaq({ question: "", answer: "" });
        showAlert("success", "FAQ added successfully");
      }
    } catch (error) {
      showAlert("error", "Failed to add FAQ");
    }
  };

  const handleUpdateFAQ = async (id, updatedFaq) => {
    try {
      const response = await fetch(`/api/courses/${courseId}/faqs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFaq)
      });

      if (response.ok) {
        await fetchFAQs();
        setEditingId(null);
        showAlert("success", "FAQ updated successfully");
      }
    } catch (error) {
      showAlert("error", "Failed to update FAQ");
    }
  };

  const handleDeleteFAQ = async (id) => {
    try {
      const response = await fetch(`/api/courses/${courseId}/faqs/${id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        await fetchFAQs();
        showAlert("success", "FAQ deleted successfully");
      }
    } catch (error) {
      showAlert("error", "Failed to delete FAQ");
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading FAQs...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Add New FAQ */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <h4 className="font-medium mb-3">Add New FAQ</h4>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Enter question"
            value={newFaq.question}
            onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
            className="w-full p-2 border rounded-lg"
          />
          <textarea
            placeholder="Enter answer"
            value={newFaq.answer}
            onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
            className="w-full p-2 border rounded-lg h-20"
          />
          <button
            onClick={handleAddFAQ}
            className="flex items-center gap-2 bg-yellow text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add FAQ
          </button>
        </div>
      </div>

      {/* FAQ List */}
      <div className="space-y-3">
        {faqs.map((faq) => (
          <FAQItem
            key={faq.id}
            faq={faq}
            isEditing={editingId === faq.id}
            onEdit={() => setEditingId(faq.id)}
            onSave={(updatedFaq) => handleUpdateFAQ(faq.id, updatedFaq)}
            onCancel={() => setEditingId(null)}
            onDelete={() => handleDeleteFAQ(faq.id)}
          />
        ))}
      </div>

      {faqs.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No FAQs added yet. Add your first FAQ above.
        </div>
      )}
    </div>
  );
};

const FAQItem = ({ faq, isEditing, onEdit, onSave, onCancel, onDelete }) => {
  const [editData, setEditData] = useState({ question: faq.question, answer: faq.answer });

  const handleSave = () => {
    if (!editData.question.trim() || !editData.answer.trim()) return;
    onSave(editData);
  };

  if (isEditing) {
    return (
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="space-y-3">
          <input
            type="text"
            value={editData.question}
            onChange={(e) => setEditData({ ...editData, question: e.target.value })}
            className="w-full p-2 border rounded-lg"
          />
          <textarea
            value={editData.answer}
            onChange={(e) => setEditData({ ...editData, answer: e.target.value })}
            className="w-full p-2 border rounded-lg h-20"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
            >
              <Save className="w-3 h-3" />
              Save
            </button>
            <button
              onClick={onCancel}
              className="flex items-center gap-1 bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
            >
              <X className="w-3 h-3" />
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h5 className="font-medium text-gray-800 mb-2">{faq.question}</h5>
          <p className="text-gray-600 text-sm">{faq.answer}</p>
        </div>
        <div className="flex gap-2 ml-4">
          <button
            onClick={onEdit}
            className="text-blue-600 hover:text-blue-800"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseFAQManager;