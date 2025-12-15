
export interface DemoProfile {
  name: string;
  idUrl: string;
  selfieUrl: string;
  type: 'VALID' | 'FRAUD';
}

// We use stable placeholder images. In a real production app, these would be hosted in your public/assets folder.
export const DEMO_PROFILES: DemoProfile[] = [
  {
    name: "Sarah Connor",
    type: 'VALID',
    // Using a clear ID-style card image
    idUrl: "https://images.unsplash.com/photo-1633265486064-086b219458ec?auto=format&fit=crop&q=80&w=1000", 
    // A woman who looks somewhat like the generic ID/avatar
    selfieUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=1000"
  },
  {
    name: "John Wick",
    type: 'FRAUD',
    // Same ID as Sarah
    idUrl: "https://images.unsplash.com/photo-1633265486064-086b219458ec?auto=format&fit=crop&q=80&w=1000",
    // Completely different person (Man)
    selfieUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=1000"
  }
];

// Helper to convert a remote URL to a browser File object
export const urlToFile = async (url: string, filename: string, mimeType: string): Promise<File> => {
  const res = await fetch(url);
  const buf = await res.arrayBuffer();
  return new File([buf], filename, { type: mimeType });
};

export const loadDemoProfile = async (profile: DemoProfile) => {
  const idFile = await urlToFile(profile.idUrl, 'demo_id.jpg', 'image/jpeg');
  const selfieFile = await urlToFile(profile.selfieUrl, 'demo_selfie.jpg', 'image/jpeg');
  
  return {
    name: profile.name,
    idFile,
    selfieFile
  };
};
