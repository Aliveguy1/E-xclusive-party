import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { Party, UserProfile } from '../types';

interface PartyCreationProps {
  user: UserProfile;
  onCreateParty: (party: Omit<Party, 'id' | 'createdAt' | 'qrCode' | 'rejectionReason'>) => void;
  onClose: () => void;
}

export const PartyCreation: React.FC<PartyCreationProps> = ({ user, onCreateParty, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    time: '',
    location: '',
    latitude: '',
    longitude: '',
    posterURL: '',
    capacity: '',
    price: '',
    genre: '',
    dressCode: '',
    ageRestriction: '',
    contactEmail: user.email,
    instagram: '',
    twitter: '',
    promoters: '',
    cancellationPolicy: 'Full refund up to 48 hours before event',
    refundPolicy: 'Money back if event is cancelled',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Party name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.posterURL.trim()) newErrors.posterURL = 'Banner/Poster image is required';
    if (!formData.capacity) newErrors.capacity = 'Capacity is required';
    else if (parseInt(formData.capacity) < 10) newErrors.capacity = 'Capacity must be at least 10 people';
    if (!formData.price) newErrors.price = 'Ticket price is required';
    else if (parseFloat(formData.price) < 0) newErrors.price = 'Price cannot be negative';
    if (!formData.genre.trim()) newErrors.genre = 'Genre/Category is required';
    if (!formData.dressCode.trim()) newErrors.dressCode = 'Dress code is required';
    if (formData.ageRestriction && parseInt(formData.ageRestriction) < 13)
      newErrors.ageRestriction = 'Minimum age must be at least 13';
    if (!formData.contactEmail.trim()) newErrors.contactEmail = 'Contact email is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handlePosterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        setFormData((prev) => ({ ...prev, posterURL: event.target.result }));
        if (errors.posterURL) {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.posterURL;
            return newErrors;
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    // Simulate submission
    setTimeout(() => {
      onCreateParty({
        hostId: user.uid,
        hostName: user.nickname,
        name: formData.name,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
        posterURL: formData.posterURL,
        status: 'PENDING',
        capacity: parseInt(formData.capacity),
        price: parseFloat(formData.price),
        genre: formData.genre,
        dressCode: formData.dressCode,
        ageRestriction: formData.ageRestriction ? parseInt(formData.ageRestriction) : undefined,
        contactEmail: formData.contactEmail,
        instagram: formData.instagram,
        twitter: formData.twitter,
        promoters: formData.promoters ? formData.promoters.split(',').map(p => p.trim()) : [],
        cancellationPolicy: formData.cancellationPolicy,
        refundPolicy: formData.refundPolicy,
        ticketsSold: 0,
      });
      setIsLoading(false);
    }, 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0b0612] border border-[#ff5cc4]/20 rounded-3xl p-8 relative"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-[#bba8d6]/55 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="mb-8">
          <h2 className="font-display text-3xl text-white uppercase tracking-tighter mb-2">
            Create Your Event
          </h2>
          <p className="text-[#bba8d6]/65 text-sm">
            Submit your party details for admin verification. Once approved, it'll go live on RiXzLa.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Name & Genre */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs text-[#ff5cc4] font-label uppercase tracking-wider mb-2 font-bold">
                Party Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full bg-[#11091c]/70 border ${
                  errors.name ? 'border-[#ff3b5c]' : 'border-[#ff5cc4]/15'
                } rounded-xl text-white px-4 py-3 focus:outline-none focus:border-[#ff2bd6] transition-colors`}
                placeholder="e.g., NEON VOID: SYNESTHESIA"
              />
              {errors.name && <p className="text-[#ff3b5c] text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs text-[#ff5cc4] font-label uppercase tracking-wider mb-2 font-bold">
                Genre/Category *
              </label>
              <select
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className={`w-full bg-[#11091c]/70 border ${
                  errors.genre ? 'border-[#ff3b5c]' : 'border-[#ff5cc4]/15'
                } rounded-xl text-white px-4 py-3 focus:outline-none focus:border-[#ff2bd6] transition-colors`}
              >
                <option value="">Select genre...</option>
                <option value="Techno">Techno</option>
                <option value="House">House</option>
                <option value="Hip-Hop">Hip-Hop</option>
                <option value="Trance">Trance</option>
                <option value="Drum & Bass">Drum & Bass</option>
                <option value="Indie">Indie</option>
                <option value="Pop">Pop</option>
                <option value="Other">Other</option>
              </select>
              {errors.genre && <p className="text-[#ff3b5c] text-xs mt-1">{errors.genre}</p>}
            </div>
          </div>

          {/* Row 2: Date & Time */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs text-[#ff5cc4] font-label uppercase tracking-wider mb-2 font-bold">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`w-full bg-[#11091c]/70 border ${
                  errors.date ? 'border-[#ff3b5c]' : 'border-[#ff5cc4]/15'
                } rounded-xl text-white px-4 py-3 focus:outline-none focus:border-[#ff2bd6] transition-colors`}
              />
              {errors.date && <p className="text-[#ff3b5c] text-xs mt-1">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-xs text-[#ff5cc4] font-label uppercase tracking-wider mb-2 font-bold">
                Time *
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className={`w-full bg-[#11091c]/70 border ${
                  errors.time ? 'border-[#ff3b5c]' : 'border-[#ff5cc4]/15'
                } rounded-xl text-white px-4 py-3 focus:outline-none focus:border-[#ff2bd6] transition-colors`}
              />
              {errors.time && <p className="text-[#ff3b5c] text-xs mt-1">{errors.time}</p>}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs text-[#ff5cc4] font-label uppercase tracking-wider mb-2 font-bold">
              Location/Venue *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={`w-full bg-[#11091c]/70 border ${
                errors.location ? 'border-[#ff3b5c]' : 'border-[#ff5cc4]/15'
              } rounded-xl text-white px-4 py-3 focus:outline-none focus:border-[#ff2bd6] transition-colors`}
              placeholder="e.g., Soundstage London"
            />
            {errors.location && <p className="text-[#ff3b5c] text-xs mt-1">{errors.location}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs text-[#ff5cc4] font-label uppercase tracking-wider mb-2 font-bold">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`w-full bg-[#11091c]/70 border ${
                errors.description ? 'border-[#ff3b5c]' : 'border-[#ff5cc4]/15'
              } rounded-xl text-white px-4 py-3 focus:outline-none focus:border-[#ff2bd6] transition-colors resize-none`}
              placeholder="Describe your event, vibe, lineup, etc..."
            />
            {errors.description && <p className="text-[#ff3b5c] text-xs mt-1">{errors.description}</p>}
          </div>

          {/* Poster/Banner */}
          <div>
            <label className="block text-xs text-[#ff5cc4] font-label uppercase tracking-wider mb-2 font-bold">
              Event Banner/Poster *
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handlePosterUpload}
                className="hidden"
                id="poster-upload"
              />
              <label
                htmlFor="poster-upload"
                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed ${
                  errors.posterURL ? 'border-[#ff3b5c]' : 'border-[#ff5cc4]/30'
                } rounded-xl cursor-pointer bg-[#11091c]/40 hover:bg-[#11091c]/60 transition-colors`}
              >
                {formData.posterURL ? (
                  <img src={formData.posterURL} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <ImageIcon size={24} className="text-[#ff5cc4]/50" />
                    <span className="text-sm text-[#bba8d6]/65">Click to upload image</span>
                  </div>
                )}
              </label>
              {errors.posterURL && <p className="text-[#ff3b5c] text-xs mt-1">{errors.posterURL}</p>}
            </div>
          </div>

          {/* Row 3: Capacity & Price */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs text-[#ff5cc4] font-label uppercase tracking-wider mb-2 font-bold">
                Capacity (Max Attendees) *
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                className={`w-full bg-[#11091c]/70 border ${
                  errors.capacity ? 'border-[#ff3b5c]' : 'border-[#ff5cc4]/15'
                } rounded-xl text-white px-4 py-3 focus:outline-none focus:border-[#ff2bd6] transition-colors`}
                placeholder="e.g., 500"
                min="10"
              />
              {errors.capacity && <p className="text-[#ff3b5c] text-xs mt-1">{errors.capacity}</p>}
            </div>

            <div>
              <label className="block text-xs text-[#ff5cc4] font-label uppercase tracking-wider mb-2 font-bold">
                Ticket Price ($) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className={`w-full bg-[#11091c]/70 border ${
                  errors.price ? 'border-[#ff3b5c]' : 'border-[#ff5cc4]/15'
                } rounded-xl text-white px-4 py-3 focus:outline-none focus:border-[#ff2bd6] transition-colors`}
                placeholder="e.g., 45"
                min="0"
                step="0.01"
              />
              {errors.price && <p className="text-[#ff3b5c] text-xs mt-1">{errors.price}</p>}
            </div>
          </div>

          {/* Row 4: Dress Code & Age */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs text-[#ff5cc4] font-label uppercase tracking-wider mb-2 font-bold">
                Dress Code *
              </label>
              <input
                type="text"
                name="dressCode"
                value={formData.dressCode}
                onChange={handleChange}
                className={`w-full bg-[#11091c]/70 border ${
                  errors.dressCode ? 'border-[#ff3b5c]' : 'border-[#ff5cc4]/15'
                } rounded-xl text-white px-4 py-3 focus:outline-none focus:border-[#ff2bd6] transition-colors`}
                placeholder="e.g., Smart Casual, Black Tie, etc."
              />
              {errors.dressCode && <p className="text-[#ff3b5c] text-xs mt-1">{errors.dressCode}</p>}
            </div>

            <div>
              <label className="block text-xs text-[#ff5cc4] font-label uppercase tracking-wider mb-2 font-bold">
                Min Age Restriction (Optional)
              </label>
              <input
                type="number"
                name="ageRestriction"
                value={formData.ageRestriction}
                onChange={handleChange}
                className={`w-full bg-[#11091c]/70 border ${
                  errors.ageRestriction ? 'border-[#ff3b5c]' : 'border-[#ff5cc4]/15'
                } rounded-xl text-white px-4 py-3 focus:outline-none focus:border-[#ff2bd6] transition-colors`}
                placeholder="e.g., 18, 21"
                min="13"
              />
              {errors.ageRestriction && <p className="text-[#ff3b5c] text-xs mt-1">{errors.ageRestriction}</p>}
            </div>
          </div>

          {/* Contact Email */}
          <div>
            <label className="block text-xs text-[#ff5cc4] font-label uppercase tracking-wider mb-2 font-bold">
              Contact Email *
            </label>
            <input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              className={`w-full bg-[#11091c]/70 border ${
                errors.contactEmail ? 'border-[#ff3b5c]' : 'border-[#ff5cc4]/15'
              } rounded-xl text-white px-4 py-3 focus:outline-none focus:border-[#ff2bd6] transition-colors`}
            />
            {errors.contactEmail && <p className="text-[#ff3b5c] text-xs mt-1">{errors.contactEmail}</p>}
          </div>

          {/* Social Media & Promoters */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs text-[#ff5cc4] font-label uppercase tracking-wider mb-2 font-bold">
                Instagram Handle (Optional)
              </label>
              <input
                type="text"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                className="w-full bg-[#11091c]/70 border border-[#ff5cc4]/15 rounded-xl text-white px-4 py-3 focus:outline-none focus:border-[#ff2bd6] transition-colors"
                placeholder="@yourhandle"
              />
            </div>
            <div>
              <label className="block text-xs text-[#ff5cc4] font-label uppercase tracking-wider mb-2 font-bold">
                Twitter Handle (Optional)
              </label>
              <input
                type="text"
                name="twitter"
                value={formData.twitter}
                onChange={handleChange}
                className="w-full bg-[#11091c]/70 border border-[#ff5cc4]/15 rounded-xl text-white px-4 py-3 focus:outline-none focus:border-[#ff2bd6] transition-colors"
                placeholder="@yourhandle"
              />
            </div>
          </div>

          {/* Promoters & Location Coords */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs text-[#ff5cc4] font-label uppercase tracking-wider mb-2 font-bold">
                Promoters (Optional)
              </label>
              <input
                type="text"
                name="promoters"
                value={formData.promoters}
                onChange={handleChange}
                className="w-full bg-[#11091c]/70 border border-[#ff5cc4]/15 rounded-xl text-white px-4 py-3 focus:outline-none focus:border-[#ff2bd6] transition-colors"
                placeholder="Enter names separated by commas"
              />
            </div>
            <div>
              <label className="block text-xs text-[#ff5cc4] font-label uppercase tracking-wider mb-2 font-bold">
                Latitude (Optional)
              </label>
              <input
                type="number"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                className="w-full bg-[#11091c]/70 border border-[#ff5cc4]/15 rounded-xl text-white px-4 py-3 focus:outline-none focus:border-[#ff2bd6] transition-colors"
                placeholder="e.g., 51.5074"
                step="0.0001"
              />
            </div>
          </div>

          {/* Longitude & Policies */}
          <div>
            <label className="block text-xs text-[#ff5cc4] font-label uppercase tracking-wider mb-2 font-bold">
              Longitude (Optional)
            </label>
            <input
              type="number"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              className="w-full bg-[#11091c]/70 border border-[#ff5cc4]/15 rounded-xl text-white px-4 py-3 focus:outline-none focus:border-[#ff2bd6] transition-colors"
              placeholder="e.g., -0.1278"
              step="0.0001"
            />
          </div>

          {/* Cancellation & Refund Policies */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs text-[#ff5cc4] font-label uppercase tracking-wider mb-2 font-bold">
                Cancellation Policy (Optional)
              </label>
              <textarea
                name="cancellationPolicy"
                value={formData.cancellationPolicy}
                onChange={handleChange}
                rows={3}
                className="w-full bg-[#11091c]/70 border border-[#ff5cc4]/15 rounded-xl text-white px-4 py-3 focus:outline-none focus:border-[#ff2bd6] transition-colors resize-none"
                placeholder="Describe your cancellation terms..."
              />
            </div>
            <div>
              <label className="block text-xs text-[#ff5cc4] font-label uppercase tracking-wider mb-2 font-bold">
                Refund Policy (Optional)
              </label>
              <textarea
                name="refundPolicy"
                value={formData.refundPolicy}
                onChange={handleChange}
                rows={3}
                className="w-full bg-[#11091c]/70 border border-[#ff5cc4]/15 rounded-xl text-white px-4 py-3 focus:outline-none focus:border-[#ff2bd6] transition-colors resize-none"
                placeholder="Describe your refund terms..."
              />
            </div>
          </div>

          {/* Info box */}
          <div className="p-4 bg-[#2bf0ff]/10 border border-[#2bf0ff]/20 rounded-xl flex gap-3">
            <AlertCircle size={18} className="text-[#2bf0ff] shrink-0 mt-0.5" />
            <p className="text-xs text-[#2bf0ff]/80">
              Your event will be automatically approved once verified by admin. This typically takes 24-48 hours.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-ghost"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn-neon disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit for Approval'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
