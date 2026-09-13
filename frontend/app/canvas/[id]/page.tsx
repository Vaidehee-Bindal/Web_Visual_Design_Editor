import Editor from '../../../components/Editor';
export default function CanvasPage({ params }: { params: { id: string } }) { return <Editor canvasId={params.id} />; }
