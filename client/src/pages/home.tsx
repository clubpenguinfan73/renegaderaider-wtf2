import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import EntranceOverlay from "@/components/entrance-overlay";
import MainContent from "@/components/main-content";
import AdminPanel from "@/components/admin-panel";
import LinkEditModal from "@/components/link-edit-modal";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { Profile, Link } from "@shared/schema";

export default function Home() {
  const [showEntrance, setShowEntrance] = useLocalStorage("showEntrance", true);
  const [isEntering, setIsEntering] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);

  const { data: profile } = useQuery<Profile>({
    queryKey: ["/api/profile"],
  });

  const { data: links = [] } = useQuery<Link[]>({
    queryKey: ["/api/links"],
  });

  const handleEnter = () => {
    setIsEntering(true);
    setTimeout(() => {
      setShowEntrance(false);
      setIsEntering(false);
    }, 1000);
  };

  const handleEditLink = (link: Link) => {
    setEditingLink(link);
    setShowLinkModal(true);
  };

  const handleNewLink = () => {
    setEditingLink(null);
    setShowLinkModal(true);
  };

  const handleCloseLinkModal = () => {
    setShowLinkModal(false);
    setEditingLink(null);
  };

  if (showEntrance) {
    return <EntranceOverlay onEnter={handleEnter} isEntering={isEntering} />;
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <MainContent 
        profile={profile}
        links={links}
        onToggleAdmin={() => setShowAdminPanel(!showAdminPanel)}
        onEditLink={handleEditLink}
      />
      
      <AdminPanel 
        isOpen={showAdminPanel}
        onClose={() => setShowAdminPanel(false)}
        profile={profile}
        links={links}
        onNewLink={handleNewLink}
        onEditLink={handleEditLink}
      />
      
      <LinkEditModal 
        isOpen={showLinkModal}
        onClose={handleCloseLinkModal}
        link={editingLink}
      />
    </div>
  );
}
