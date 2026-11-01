import AdminShell from '../../../components/admin/AdminShell';
import BlogEditor from '../../../components/admin/BlogEditor';

export default function NewBlogPage() {
  return (
    <AdminShell title="New article">
      <BlogEditor />
    </AdminShell>
  );
}
