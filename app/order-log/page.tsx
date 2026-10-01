import Table from '../components/OrderLogTable';
import Header from '../components/Header';
import FormHeader from '../components//ui/FormHeader';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
const page = async () => {
  return (
    <div>
      <Header />
      <FormHeader
        icon={<EventNoteOutlinedIcon />}
        eyebrow="Production scheduler"
        title={' Log'}
        description={'View the log of all production activity.'}
        titleAs="h1"
        badge={
          <span className="shrink-0 rounded border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-900">
            Active
          </span>
        }
        className="border-b border-slate-200 border-l-4 border-l-emerald-600 bg-slate-50 px-6 py-5"
      />
      <Table />
    </div>
  );
};

export default page;
