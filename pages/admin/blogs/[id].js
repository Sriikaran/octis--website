import { useRouter } from 'next/router';
import AdminShell from '../../../components/admin/AdminShell';
import BlogEditor from '../../../components/admin/BlogEditor';

export default function EditBlogPage() {
  const router = useRouter();
  const id = typeof router.query.id === 'string' ? router.query.id : '';
  return (
    <AdminShell title="Edit article">
      {id ? <BlogEditor postId={id} /> : null}
    </AdminShell>
  );
}
