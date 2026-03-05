import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../../context/useUser.js";
import { useToast } from "../../../../hooks/useToast.js";
import Button from "../../../../components/common/Button.jsx";
import ProfilePageFrame from "./ProfilePageFrame.jsx";

export default function ProfileEdit() {
  const navigate = useNavigate();
  const { user, updateUser } = useUser();
  const toast = useToast();

  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [avatarFileName, setAvatarFileName] = useState("No file chosen");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [gravatarEmail, setGravatarEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showBookmarks, setShowBookmarks] = useState("yes");
  const [gender, setGender] = useState("female");
  const [profileLocation, setProfileLocation] = useState("");
  const [timezone, setTimezone] = useState("default-gmt-plus-3");
  const [about, setAbout] = useState("");
  const [signature, setSignature] = useState("");
  const [isAvatarProcessing, setIsAvatarProcessing] = useState(false);

  useEffect(() => {
    setProfileName(user?.username || "");
    setProfileEmail(user?.email || "");
    setAvatarUrl(user?.avatar || "");
    setGravatarEmail(user?.email || "");
    setShowBookmarks(user?.profileSettings?.showBookmarksToEveryone === false ? "no" : "yes");
    setGender(user?.profileSettings?.gender || "female");
    setProfileLocation(user?.profileSettings?.location || "");
    setTimezone(user?.profileSettings?.timezone || "default-gmt-plus-3");
    setAbout(user?.profileSettings?.about || "");
    setSignature(user?.profileSettings?.signature || "");
    setAvatarFileName("No file chosen");
  }, [user]);

  const handleAvatarChange = React.useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (!file) {
        setAvatarFileName("No file chosen");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file.");
        return;
      }

      setAvatarFileName(file.name);
      setIsAvatarProcessing(true);

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result !== "string") {
          setIsAvatarProcessing(false);
          toast.error("Failed to process image.");
          return;
        }

        const img = new Image();
        img.onload = () => {
          const size = 256;
          const canvas = document.createElement("canvas");
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            setIsAvatarProcessing(false);
            toast.error("Failed to process image.");
            return;
          }

          const srcSize = Math.min(img.width, img.height);
          const sx = (img.width - srcSize) / 2;
          const sy = (img.height - srcSize) / 2;
          ctx.drawImage(img, sx, sy, srcSize, srcSize, 0, 0, size, size);
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.85);
          setAvatarUrl(compressedDataUrl);
          setIsAvatarProcessing(false);
        };
        img.onerror = () => {
          setIsAvatarProcessing(false);
          toast.error("Invalid image file.");
        };
        img.src = reader.result;
      };
      reader.onerror = () => {
        setIsAvatarProcessing(false);
        toast.error("Failed to read image.");
      };
      reader.readAsDataURL(file);
    },
    [toast]
  );

  const handleDeleteAvatar = React.useCallback(() => {
    setAvatarUrl("");
    setAvatarFileName("No file chosen");
  }, []);

  const handleProfileSave = React.useCallback(
    (e) => {
      e.preventDefault();
      if (newPassword && newPassword !== repeatPassword) {
        toast.error("New password and repeat password do not match.");
        return;
      }
      if (isAvatarProcessing) {
        toast.error("Please wait until avatar processing finishes.");
        return;
      }

      updateUser({
        username: profileName.trim() || user?.username || "",
        email: profileEmail.trim() || user?.email || "",
        avatar: avatarUrl,
        profileSettings: {
          ...(user?.profileSettings || {}),
          gravatarEmail: gravatarEmail.trim(),
          showBookmarksToEveryone: showBookmarks === "yes",
          gender,
          location: profileLocation.trim(),
          timezone,
          about: about.trim(),
          signature: signature.trim(),
        },
      });

      setOldPassword("");
      setNewPassword("");
      setRepeatPassword("");
      navigate("/profile/watching");
      toast.success("Profile updated.");
    },
    [
      about,
      avatarUrl,
      gender,
      gravatarEmail,
      profileLocation,
      isAvatarProcessing,
      navigate,
      newPassword,
      profileEmail,
      profileName,
      repeatPassword,
      showBookmarks,
      signature,
      timezone,
      toast,
      updateUser,
      user,
    ]
  );

  const visibleAvatar = avatarUrl || user?.avatar || "https://via.placeholder.com/120?text=Avatar";

  return (
    <ProfilePageFrame isEditPage avatarOverride={avatarUrl}>
      <section className="profile-edit-panel" aria-labelledby="edit-profile-heading">
        <h2 id="edit-profile-heading" className="edit-title">
          Profile Editing
        </h2>
        <form className="edit-form" onSubmit={handleProfileSave}>
          <div className="edit-grid">
            <div className="edit-field">
              <label htmlFor="profile-name">Your Name:</label>
              <input
                id="profile-name"
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="Your Name"
              />
            </div>

            <div className="edit-field">
              <label htmlFor="profile-email">Your E-Mail:</label>
              <input
                id="profile-email"
                type="email"
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                placeholder="your@email.com"
              />
            </div>

            <div className="edit-field edit-field-full">
              <label htmlFor="avatar-file">Avatar:</label>
              <img className="edit-avatar-preview" src={visibleAvatar} alt="Avatar preview" loading="lazy" />
              <input
                id="avatar-file"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleAvatarChange}
              />
              <span className="edit-hint">{avatarFileName}</span>
              {isAvatarProcessing ? <span className="edit-hint">Processing image...</span> : null}
            </div>

            <div className="edit-field">
              <label htmlFor="gravatar-email">Gravatar Service:</label>
              <input
                id="gravatar-email"
                type="email"
                value={gravatarEmail}
                onChange={(e) => setGravatarEmail(e.target.value)}
                placeholder="Specify your email in this service"
              />
            </div>

            <div className="edit-field">
              <label>&nbsp;</label>
              <Button type="button" variant="ghost" size="small" onClick={handleDeleteAvatar}>
                Delete Avatar
              </Button>
            </div>
          </div>

          <h3 className="edit-section-title">Security</h3>
          <div className="edit-grid">
            <div className="edit-field">
              <label htmlFor="old-password">Old Password:</label>
              <input
                id="old-password"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Old Password"
              />
            </div>
            <div className="edit-field">
              <label htmlFor="new-password">New Password:</label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
              />
            </div>
            <div className="edit-field">
              <label htmlFor="repeat-password">Repeat Password:</label>
              <input
                id="repeat-password"
                type="password"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                placeholder="Repeat New Password"
              />
            </div>
          </div>

          <h3 className="edit-section-title">Information About You</h3>
          <div className="edit-grid">
            <div className="edit-field">
              <label htmlFor="show-bookmarks">Show bookmarks to everyone:</label>
              <select id="show-bookmarks" value={showBookmarks} onChange={(e) => setShowBookmarks(e.target.value)}>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            <div className="edit-field">
              <label htmlFor="gender">Your gender:</label>
              <select id="gender" value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
                <option value="prefer-not">Prefer not to say</option>
              </select>
            </div>

            <div className="edit-field">
              <label htmlFor="location">Place of residence:</label>
              <input
                id="location"
                type="text"
                value={profileLocation}
                onChange={(e) => setProfileLocation(e.target.value)}
                placeholder="Place of residence"
              />
            </div>

            <div className="edit-field">
              <label htmlFor="timezone">Timezone:</label>
              <select id="timezone" value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                <option value="default-gmt-plus-3">
                  Default system settings (GMT+03:00) Russia, Moscow
                </option>
                <option value="gmt-5">GMT-05:00 Eastern Time</option>
                <option value="gmt">GMT+00:00 UTC</option>
                <option value="gmt+1">GMT+01:00 Central European Time</option>
                <option value="gmt+9">GMT+09:00 Japan Standard Time</option>
              </select>
            </div>

            <div className="edit-field edit-field-full">
              <label htmlFor="about">About me:</label>
              <textarea id="about" value={about} onChange={(e) => setAbout(e.target.value)} rows={4} />
            </div>

            <div className="edit-field edit-field-full">
              <label htmlFor="signature">Signature:</label>
              <textarea
                id="signature"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                rows={3}
                disabled
              />
              <span className="edit-hint">
                Do not fill in this field, because your group is not allowed to use signatures in comments.
              </span>
            </div>
          </div>

          <div className="edit-actions">
            <Button type="submit" variant="primary" size="small">
              Submit
            </Button>
          </div>
        </form>
      </section>
    </ProfilePageFrame>
  );
}
