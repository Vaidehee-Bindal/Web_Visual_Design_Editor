import "./styles.css";
import "./editor-enhancements.css";
import "./sidebar.css";
import "./right-panel.css";
import "./auth.css";
import "./title.css";
import "./text-edit.css";
import "./line-tool.css";
import "./canvas-size.css";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "SketchStack — Design canvas",
  description: "A focused visual design editor",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
