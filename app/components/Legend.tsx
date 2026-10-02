const Legend = () => {
  return (
    <div>
      <div className="flex flex-wrap gap-3 mt-2">
        <div className="flex items-center gap-2 text-sm">
          <span className="w-3 h-3 rounded-sm" style={{ background: '#f39c12' }} />{' '}
          <span>Pending</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="w-3 h-3 rounded-sm" style={{ background: '#007bff' }} />{' '}
          <span>Scheduled</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="w-3 h-3 rounded-sm" style={{ background: '#DB441A' }} />{' '}
          <span>Busy</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="w-3 h-3 rounded-sm" style={{ background: '#2ecc71' }} />{' '}
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="w-3 h-3 rounded-sm" style={{ background: '#092ec0' }} />{' '}
          <span>Deleted</span>
        </div>
      </div>
    </div>
  );
};

export default Legend;
