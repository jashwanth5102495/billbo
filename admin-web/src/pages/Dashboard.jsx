import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  LayoutDashboard, 
  Megaphone, 
  Store, 
  LogOut, 
  Plus, 
  Search,
  ClipboardList,
  Pencil,
  X,
  Trash2,
  Download,
  PlayCircle,
  Image as ImageIcon,
  FileText
} from 'lucide-react';
import api from '../api';
import './Dashboard.css';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('billboard-owners');
  const [owners, setOwners] = useState([]);
  const [businessOwners, setBusinessOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    phoneNumber: '',
    email: ''
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  
  // New Requests State
  const [connectRequests, setConnectRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  
  // Edit Owner States
  const [editingOwner, setEditingOwner] = useState(null);
  const [ownerBillboards, setOwnerBillboards] = useState([]);
  const [editTab, setEditTab] = useState('profile');
  const [showBillboardForm, setShowBillboardForm] = useState(false);
  const [billboardForm, setBillboardForm] = useState({
    name: '',
    location: '',
    price: '',
    slotPricing: { morning: '', afternoon: '', evening: '', night: '' },
    image: '',
    dimensions: '',
    dailyFootfall: '',
    type: 'Digital',
    description: ''
  });
  const [editingBillboardId, setEditingBillboardId] = useState(null);
  const [newBillboards, setNewBillboards] = useState([]);
  const [isAddingBillboard, setIsAddingBillboard] = useState(false);
  const [newBillboardData, setNewBillboardData] = useState({
    name: '',
    location: '',
    price: '',
    slotPricing: { morning: '', afternoon: '', evening: '', night: '' },
    image: '',
    dimensions: '',
    dailyFootfall: '',
    type: 'Digital',
    description: ''
  });

  // Running Ads Tab States
  const [runningAds, setRunningAds] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [runningAdsLoading, setRunningAdsLoading] = useState(false);
  const [runningAdsTab, setRunningAdsTab] = useState('bookings'); // bookings, active, availability

  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/login');
  }, [navigate]);

  const fetchBusinessOwners = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/business-owners');
      if (response.data.success) {
        setBusinessOwners(response.data.owners);
      }
    } catch (error) {
      console.error('Error fetching business owners:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRequests = useCallback(async () => {
    setRequestsLoading(true);
    try {
      const response = await api.get('/requests/connect');
      if (response.data.success) {
        setConnectRequests(response.data.requests);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setRequestsLoading(false);
    }
  }, []);

  const updateRequestStatus = async (id, status) => {
    try {
      const response = await api.put(`/requests/connect/${id}`, { status });
      if (response.data.success) {
        setConnectRequests(connectRequests.map(req => 
          req._id === id ? { ...req, status } : req
        ));
      }
    } catch (error) {
      console.error('Error updating request status:', error);
      alert('Failed to update status');
    }
  };

  const fetchOwners = useCallback(async () => {
    try {
      const response = await api.get('/admin/owners');
      if (response.data.success) {
        setOwners(response.data.owners);
      }
    } catch (error) {
      console.error('Error fetching owners:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  }, [handleLogout]);

  const fetchRunningAdsData = useCallback(async () => {
    setRunningAdsLoading(true);
    try {
      const [bookingsRes, runningRes, availRes] = await Promise.all([
        api.get('/admin/bookings'),
        api.get('/admin/running-ads'),
        api.get('/admin/availability')
      ]);

      if (bookingsRes.data.success) setAllBookings(bookingsRes.data.bookings);
      if (runningRes.data.success) setRunningAds(runningRes.data.bookings);
      if (availRes.data.success) setAvailability(availRes.data.billboards);
    } catch (error) {
      console.error('Error fetching running ads data:', error);
    } finally {
      setRunningAdsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'billboard-owners') {
      fetchOwners();
    } else if (activeTab === 'new-requests') {
      fetchRequests();
    } else if (activeTab === 'running-ads') {
      fetchRunningAdsData();
    } else if (activeTab === 'business-owners') {
      fetchBusinessOwners();
    }
  }, [activeTab, fetchOwners, fetchRequests, fetchRunningAdsData, fetchBusinessOwners]);

  const handleCreateOwner = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      // 1. Create the Owner
      const response = await api.post('/admin/create-owner', formData);
      if (response.data.success) {
        const newOwnerId = response.data.user.id;
        
        // 2. Create Billboards for this Owner if any
        if (newBillboards.length > 0) {
          try {
            await Promise.all(newBillboards.map(bb => {
              const payload = { ...bb };
              if (payload.type === 'Digital') {
                delete payload.price;
                payload.slotPricing = {
                  morning: Number(payload.slotPricing?.morning) || 0,
                  afternoon: Number(payload.slotPricing?.afternoon) || 0,
                  evening: Number(payload.slotPricing?.evening) || 0,
                  night: Number(payload.slotPricing?.night) || 0
                };
              } else {
                delete payload.slotPricing;
                payload.price = Number(payload.price) || 0;
              }
              return api.post(`/admin/owners/${newOwnerId}/billboards`, payload);
            }));
          } catch (bbError) {
            console.error('Error creating initial billboards:', bbError);
            alert('Owner created, but some billboards failed to add.');
          }
        }

        setFormData({ username: '', password: '', name: '', phoneNumber: '', email: '' });
        setNewBillboards([]);
        setIsAddingBillboard(false);
        fetchOwners(); 
        alert('Billboard Owner created successfully!');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create owner');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleAddBillboardToNewOwner = () => {
    setNewBillboards([...newBillboards, { ...newBillboardData, id: Date.now() }]);
    setNewBillboardData({
        name: '', location: '', price: '', slotPricing: { morning: '', afternoon: '', evening: '', night: '' }, image: '', dimensions: '', dailyFootfall: '', type: 'Digital', description: ''
    });
    setIsAddingBillboard(false);
  };

  const handleEditClick = async (owner) => {
    setEditingOwner(owner);
    setEditTab('profile');
    try {
      const response = await api.get(`/admin/owners/${owner._id}/billboards`);
      if (response.data.success) {
        setOwnerBillboards(response.data.billboards);
      }
    } catch (error) {
      console.error('Error fetching owner billboards:', error);
    }
  };

  const handleUpdateOwner = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/admin/owners/${editingOwner._id}`, editingOwner);
      if (response.data.success) {
        alert('Owner updated successfully');
        fetchOwners();
        // Don't close modal, just update state
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update owner');
    }
  };

  const handleBillboardSubmit = async (e) => {
    e.preventDefault();
    try {
      // Prepare payload
      const payload = { ...billboardForm };
      
      if (payload.type === 'Digital') {
        // Ensure price is handled (optional in backend now)
        delete payload.price;
        // Ensure slot pricing numbers are valid
        payload.slotPricing = {
          morning: Number(payload.slotPricing?.morning) || 0,
          afternoon: Number(payload.slotPricing?.afternoon) || 0,
          evening: Number(payload.slotPricing?.evening) || 0,
          night: Number(payload.slotPricing?.night) || 0
        };
      } else {
        // Static billboard
        delete payload.slotPricing;
        payload.price = Number(payload.price) || 0;
      }

      let response;
      if (editingBillboardId) {
        response = await api.put(`/admin/owners/${editingOwner._id}/billboards/${editingBillboardId}`, payload);
      } else {
        response = await api.post(`/admin/owners/${editingOwner._id}/billboards`, payload);
      }

      if (response.data.success) {
        alert(`Billboard ${editingBillboardId ? 'updated' : 'added'} successfully`);
        // Refresh billboards list
        const billboardsRes = await api.get(`/admin/owners/${editingOwner._id}/billboards`);
        setOwnerBillboards(billboardsRes.data.billboards);
        
        // Reset form
        setShowBillboardForm(false);
        setEditingBillboardId(null);
        setBillboardForm({
           name: '', location: '', price: '', slotPricing: { morning: '', afternoon: '', evening: '', night: '' }, image: '', dimensions: '', dailyFootfall: '', type: 'Digital', description: ''
         });
       }
     } catch (error) {
      alert(error.response?.data?.message || 'Failed to save billboard');
    }
  };

  const renderEditModal = () => {
    if (!editingOwner) return null;

    return (
      <div className="modal-overlay" onClick={() => setEditingOwner(null)}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3 className="modal-title">Edit Owner: {editingOwner.name}</h3>
            <button className="close-btn" onClick={() => setEditingOwner(null)}>
              <X size={24} />
            </button>
          </div>
          
          <div className="modal-body">
            <div className="tabs">
              <div 
                className={`tab ${editTab === 'profile' ? 'active' : ''}`}
                onClick={() => setEditTab('profile')}
              >
                Profile Details
              </div>
              <div 
                className={`tab ${editTab === 'billboards' ? 'active' : ''}`}
                onClick={() => setEditTab('billboards')}
              >
                Manage Billboards
              </div>
            </div>

            {editTab === 'profile' && (
              <form onSubmit={handleUpdateOwner}>
                <div className="edit-form-grid">
                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: 'var(--text-secondary)' }}>Full Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editingOwner.name || ''}
                      onChange={(e) => setEditingOwner({...editingOwner, name: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: 'var(--text-secondary)' }}>Username</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editingOwner.username || ''}
                      onChange={(e) => setEditingOwner({...editingOwner, username: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: 'var(--text-secondary)' }}>Phone Number</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editingOwner.phoneNumber || ''}
                      onChange={(e) => setEditingOwner({...editingOwner, phoneNumber: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: 'var(--text-secondary)' }}>Email</label>
                    <input
                      type="email"
                      className="form-input"
                      value={editingOwner.email || ''}
                      onChange={(e) => setEditingOwner({...editingOwner, email: e.target.value})}
                    />
                  </div>
                </div>
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" className="btn-primary">Save Changes</button>
                </div>
              </form>
            )}

            {editTab === 'billboards' && (
              <div>
                {!showBillboardForm ? (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h4 style={{ margin: 0 }}>Existing Billboards ({ownerBillboards.length})</h4>
                      <button 
                        className="btn-primary"
                        onClick={() => {
                          setBillboardForm({
                            name: '', location: '', price: '', slotPricing: { morning: '', afternoon: '', evening: '', night: '' }, image: '', dimensions: '', dailyFootfall: '', type: 'Digital', description: ''
                          });
                          setEditingBillboardId(null);
                          setShowBillboardForm(true);
                        }}
                      >
                        <Plus size={16} style={{ marginRight: '5px' }} /> Add Billboard
                      </button>
                    </div>
                    
                    <div className="billboards-list">
                      {ownerBillboards.length > 0 ? (
                        ownerBillboards.map(bb => (
                          <div key={bb._id} className="billboard-item">
                            <div className="billboard-info">
                              <h4>{bb.name}</h4>
                              <p>{bb.location} • {bb.type}</p>
                              <p style={{ color: 'var(--accent-blue)', marginTop: '4px' }}>₹{bb.price}/day</p>
                            </div>
                            <div className="billboard-actions">
                              <button 
                                className="action-icon-btn"
                                onClick={() => {
                                  setBillboardForm(bb);
                                  setEditingBillboardId(bb._id);
                                  setShowBillboardForm(true);
                                }}
                              >
                                <Pencil size={16} />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px' }}>No billboards found for this owner.</p>
                      )}
                    </div>
                  </>
                ) : (
                  <form onSubmit={handleBillboardSubmit}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '10px' }}>
                      <button 
                        type="button" 
                        className="btn-secondary" 
                        style={{ padding: '4px 8px' }}
                        onClick={() => setShowBillboardForm(false)}
                      >
                        ← Back
                      </button>
                      <h4 style={{ margin: 0 }}>{editingBillboardId ? 'Edit Billboard' : 'Add New Billboard'}</h4>
                    </div>
                    
                    <div className="edit-form-grid">
                      <div className="form-group">
                        <input type="text" className="form-input" placeholder="Billboard Name" required
                          value={billboardForm.name} onChange={e => setBillboardForm({...billboardForm, name: e.target.value})} />
                      </div>
                      <div className="form-group">
                        <input type="text" className="form-input" placeholder="Location" required
                          value={billboardForm.location} onChange={e => setBillboardForm({...billboardForm, location: e.target.value})} />
                      </div>
                      
                      <div className="form-group">
                        <select className="form-input" value={billboardForm.type} onChange={e => setBillboardForm({...billboardForm, type: e.target.value})}>
                          <option value="Digital">Digital</option>
                          <option value="Static">Static</option>
                        </select>
                      </div>

                      {billboardForm.type === 'Digital' ? (
                        <>
                          <div className="form-group">
                            <input type="number" className="form-input" placeholder="Morning Price (₹)" 
                              value={billboardForm.slotPricing?.morning || ''} 
                              onChange={e => setBillboardForm({
                                ...billboardForm, 
                                slotPricing: { ...billboardForm.slotPricing, morning: e.target.value }
                              })} />
                          </div>
                          <div className="form-group">
                            <input type="number" className="form-input" placeholder="Afternoon Price (₹)" 
                              value={billboardForm.slotPricing?.afternoon || ''} 
                              onChange={e => setBillboardForm({
                                ...billboardForm, 
                                slotPricing: { ...billboardForm.slotPricing, afternoon: e.target.value }
                              })} />
                          </div>
                          <div className="form-group">
                            <input type="number" className="form-input" placeholder="Evening Price (₹)" 
                              value={billboardForm.slotPricing?.evening || ''} 
                              onChange={e => setBillboardForm({
                                ...billboardForm, 
                                slotPricing: { ...billboardForm.slotPricing, evening: e.target.value }
                              })} />
                          </div>
                          <div className="form-group">
                            <input type="number" className="form-input" placeholder="Night Price (₹)" 
                              value={billboardForm.slotPricing?.night || ''} 
                              onChange={e => setBillboardForm({
                                ...billboardForm, 
                                slotPricing: { ...billboardForm.slotPricing, night: e.target.value }
                              })} />
                          </div>
                        </>
                      ) : (
                        <div className="form-group">
                          <input type="number" className="form-input" placeholder="Price per Day" required
                            value={billboardForm.price} onChange={e => setBillboardForm({...billboardForm, price: e.target.value})} />
                        </div>
                      )}

                      <div className="form-group">
                        <input type="text" className="form-input" placeholder="Dimensions (e.g. 20x10ft)"
                          value={billboardForm.dimensions} onChange={e => setBillboardForm({...billboardForm, dimensions: e.target.value})} />
                      </div>
                      <div className="form-group">
                        <input type="text" className="form-input" placeholder="Daily Footfall (e.g. 5000+)"
                          value={billboardForm.dailyFootfall} onChange={e => setBillboardForm({...billboardForm, dailyFootfall: e.target.value})} />
                      </div>

                      <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <textarea className="form-input" placeholder="Description" rows="3"
                          value={billboardForm.description} onChange={e => setBillboardForm({...billboardForm, description: e.target.value})}></textarea>
                      </div>
                    </div>
                    
                    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                      <button type="button" className="btn-secondary" onClick={() => setShowBillboardForm(false)}>Cancel</button>
                      <button type="submit" className="btn-primary">{editingBillboardId ? 'Update Billboard' : 'Add Billboard'}</button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderNewRequestsContent = () => (
    <div className="list-container">
      <div className="list-header">
        New Connect Requests ({connectRequests.length})
      </div>

      {requestsLoading ? (
        <div className="empty-state">Loading...</div>
      ) : connectRequests.length > 0 ? (
        <table className="owner-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Contact Person</th>
              <th>Phone</th>
              <th>Brand & Model</th>
              <th>Address</th>
              <th>Purchase Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {connectRequests.map((req) => (
              <tr key={req._id}>
                <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                <td>{req.contactPerson}</td>
                <td>{req.contactNumber}</td>
                <td>{req.brand}</td>
                <td>{req.address}</td>
                <td>{req.purchaseDate}</td>
                <td>
                  <span className={`status-badge status-${req.status.toLowerCase()}`}>
                    {req.status}
                  </span>
                </td>
                <td>
                  <select 
                    value={req.status} 
                    onChange={(e) => updateRequestStatus(req._id, e.target.value)}
                    className="status-select"
                    style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ddd', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Verified">Verified</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="empty-state">
          <ClipboardList className="empty-icon" />
          <p>No new requests</p>
        </div>
      )}
    </div>
  );

  const renderContentCell = (booking) => {
    const content = booking.content || {};
    
    if (content.type === 'video' && content.url) {
      return (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <a 
            href={content.url} 
            target="_blank" 
            rel="noopener noreferrer"
            title="Play Video"
            style={{ color: '#3B82F6', cursor: 'pointer' }}
          >
            <PlayCircle size={18} />
          </a>
          <a 
            href={content.url} 
            download
            target="_blank"
            rel="noopener noreferrer"
            title="Download Video"
            style={{ color: '#10B981', cursor: 'pointer' }}
          >
            <Download size={18} />
          </a>
        </div>
      );
    } else if (content.type === 'image' && content.url) {
      return (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <a 
            href={content.url} 
            target="_blank" 
            rel="noopener noreferrer"
            title="View Image"
            style={{ color: '#3B82F6', cursor: 'pointer' }}
          >
            <ImageIcon size={18} />
          </a>
          <a 
            href={content.url} 
            download
            target="_blank"
            rel="noopener noreferrer"
            title="Download Image"
            style={{ color: '#10B981', cursor: 'pointer' }}
          >
            <Download size={18} />
          </a>
        </div>
      );
    } else if (content.type === 'text' || content.text) {
      return (
        <div title={content.text} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
           <FileText size={16} color="#6B7280" />
           <span style={{ fontSize: '12px', maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
             {content.text}
           </span>
        </div>
      );
    }
    
    return <span style={{ color: '#9CA3AF', fontSize: '12px' }}>No Content</span>;
  };

  const renderRunningAdsContent = () => (
    <div className="list-container">
      <div className="list-header" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>Ads & Availability Management</div>
        <div className="tabs" style={{ marginBottom: 0, borderBottom: 'none' }}>
          <div 
            className={`tab ${runningAdsTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setRunningAdsTab('bookings')}
            style={{ padding: '8px 16px', fontSize: '14px' }}
          >
            All Bookings ({allBookings.length})
          </div>
          <div 
            className={`tab ${runningAdsTab === 'active' ? 'active' : ''}`}
            onClick={() => setRunningAdsTab('active')}
            style={{ padding: '8px 16px', fontSize: '14px' }}
          >
            Running Ads ({runningAds.length})
          </div>
          <div 
            className={`tab ${runningAdsTab === 'availability' ? 'active' : ''}`}
            onClick={() => setRunningAdsTab('availability')}
            style={{ padding: '8px 16px', fontSize: '14px' }}
          >
            Availability ({availability.length})
          </div>
        </div>
      </div>

      {runningAdsLoading ? (
        <div className="empty-state">Loading data...</div>
      ) : (
        <>
          {runningAdsTab === 'bookings' && (
            allBookings.length > 0 ? (
              <table className="owner-table">
                <thead>
                  <tr>
                    <th>Date Booked</th>
                    <th>Billboard</th>
                    <th>Business Owner</th>
                    <th>Ad Content</th>
                    <th>Schedule</th>
                    <th>Specs</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {allBookings.map((booking) => (
                    <tr key={booking._id}>
                      <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{booking.billboardId?.name || 'Unknown'}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{booking.billboardId?.location}</div>
                      </td>
                      <td>{booking.userId?.name || 'Unknown'}</td>
                      <td>{renderContentCell(booking)}</td>
                      <td>
                        {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                      </td>
                      <td>
                        <div style={{ fontSize: '12px' }}>Video: {booking.videoDuration || 0}s</div>
                        <div style={{ fontSize: '12px' }}>Rep: {booking.reputation || 40}</div>
                      </td>
                      <td>₹{booking.amount || booking.price || 0}</td>
                      <td>
                        <span className={`status-badge status-${booking.status.toLowerCase()}`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <p>No bookings found.</p>
              </div>
            )
          )}

          {runningAdsTab === 'active' && (
            runningAds.length > 0 ? (
              <table className="owner-table">
                <thead>
                  <tr>
                    <th>Billboard</th>
                    <th>Business Owner</th>
                    <th>Ad Content</th>
                    <th>Campaign Schedule</th>
                    <th>Specs</th>
                    <th>Time Remaining</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {runningAds.map((booking) => {
                    const end = new Date(booking.endDate);
                    const now = new Date();
                    const diffTime = Math.abs(end - now);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                    
                    return (
                      <tr key={booking._id}>
                        <td>
                          <div style={{ fontWeight: 500 }}>{booking.billboardId?.name || 'Unknown'}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{booking.billboardId?.location}</div>
                        </td>
                        <td>{booking.userId?.name || 'Unknown'}</td>
                        <td>{renderContentCell(booking)}</td>
                        <td>
                          {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                        </td>
                        <td>
                          <div style={{ fontSize: '12px' }}>Video: {booking.videoDuration || 0}s</div>
                          <div style={{ fontSize: '12px' }}>Rep: {booking.reputation || 40}</div>
                        </td>
                        <td>
                          {end > now ? `${diffDays} days left` : 'Ended'}
                        </td>
                        <td>
                          <span className="status-badge status-active">Running</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <p>No currently running ads.</p>
              </div>
            )
          )}

          {runningAdsTab === 'availability' && (
            availability.length > 0 ? (
              <table className="owner-table">
                <thead>
                  <tr>
                    <th>Billboard Name</th>
                    <th>Location</th>
                    <th>Owner</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Next Availability</th>
                  </tr>
                </thead>
                <tbody>
                  {availability.map((bb) => (
                    <tr key={bb._id}>
                      <td>{bb.name}</td>
                      <td>{bb.location}</td>
                      <td>{bb.ownerId?.name || 'Unknown'}</td>
                      <td>{bb.type}</td>
                      <td>
                        {bb.isBooked ? (
                          <span className="status-badge status-inactive">Booked</span>
                        ) : (
                          <span className="status-badge status-active">Available</span>
                        )}
                      </td>
                      <td>
                        {bb.isBooked && bb.currentBooking ? 
                          `After ${new Date(bb.currentBooking.endDate).toLocaleDateString()}` : 
                          'Available Now'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <p>No billboards found.</p>
              </div>
            )
          )}
        </>
      )}
    </div>
  );

  const renderBusinessOwnersContent = () => (
    <div className="list-container">
      <div className="list-header">
        Business Owners ({businessOwners.length})
      </div>

      {loading ? (
        <div className="empty-state">Loading...</div>
      ) : businessOwners.length > 0 ? (
        <table className="owner-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Status</th>
              <th>Joined Date</th>
            </tr>
          </thead>
          <tbody>
            {businessOwners.map((owner) => (
              <tr key={owner._id}>
                <td>{owner.name || 'N/A'}</td>
                <td>{owner.username || 'N/A'}</td>
                <td>{owner.phoneNumber || 'N/A'}</td>
                <td>{owner.email || 'N/A'}</td>
                <td>
                  <span className={`status-badge ${owner.isActive ? 'status-active' : 'status-inactive'}`}>
                    {owner.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>{new Date(owner.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="empty-state">
          <Store className="empty-icon" />
          <p>No business owners found</p>
        </div>
      )}
    </div>
  );

  const renderSidebar = () => (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">Admin Dashboard</h1>
        <p className="sidebar-subtitle">Management Portal</p>
      </div>

      <nav className="nav-menu">
        <div 
          className={`nav-item ${activeTab === 'new-requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('new-requests')}
        >
          <ClipboardList size={20} className="nav-icon" />
          New Requests
        </div>
        <div 
          className={`nav-item ${activeTab === 'billboard-owners' ? 'active' : ''}`}
          onClick={() => setActiveTab('billboard-owners')}
        >
          <Users size={20} className="nav-icon" />
          Billboard Owners
        </div>
        <div 
          className={`nav-item ${activeTab === 'business-owners' ? 'active' : ''}`}
          onClick={() => setActiveTab('business-owners')}
        >
          <Store size={20} className="nav-icon" />
          Business Owners
        </div>
        <div 
          className={`nav-item ${activeTab === 'running-ads' ? 'active' : ''}`}
          onClick={() => setActiveTab('running-ads')}
        >
          <Megaphone size={20} className="nav-icon" />
          Running Ads
        </div>
      </nav>

      <div className="sidebar-footer">
        <button onClick={() => navigate('/')} className="logout-btn">
          Back to Home
        </button>
      </div>
    </aside>
  );

  const renderBillboardOwnersContent = () => (
    <>
      <div className="dashboard-grid">
        {/* Add New Owner Card */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Add New Billboard Owner</h3>
            <button 
              onClick={handleCreateOwner} 
              disabled={submitLoading}
              className="action-btn"
            >
              {submitLoading ? 'Creating...' : 'Add Owner'}
            </button>
          </div>
          
          <form className="create-owner-form">
            <div className="form-grid">
              <div className="form-group">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Username"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  className="form-input"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                />
              </div>
            </div>
            <div className="form-group">
                <input
                  type="email"
                  className="form-input"
                  placeholder="Email (Optional)"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
            </div>

            {/* Initial Billboards Section */}
            <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h4 style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>Initial Billboards ({newBillboards.length})</h4>
                    <button 
                        type="button"
                        className="btn-secondary"
                        style={{ padding: '4px 10px', fontSize: '12px' }}
                        onClick={() => setIsAddingBillboard(true)}
                    >
                        + Add Billboard
                    </button>
                </div>

                {newBillboards.length > 0 && (
                    <div className="billboards-list" style={{ marginBottom: '15px' }}>
                        {newBillboards.map(bb => (
                            <div key={bb.id} className="billboard-item" style={{ padding: '10px' }}>
                                <div className="billboard-info">
                                    <h4 style={{ fontSize: '14px' }}>{bb.name}</h4>
                                    <p style={{ fontSize: '12px' }}>{bb.location} • {bb.type}</p>
                                </div>
                                <button 
                                    type="button"
                                    className="action-icon-btn"
                                    onClick={() => setNewBillboards(newBillboards.filter(b => b.id !== bb.id))}
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {isAddingBillboard && (
                    <div className="card" style={{ padding: '15px', marginBottom: '15px', border: '1px dashed var(--border-color)' }}>
                        <h5 style={{ marginTop: 0, marginBottom: '15px' }}>New Billboard Details</h5>
                        <div className="edit-form-grid">
                            <div className="form-group">
                                <input type="text" className="form-input" placeholder="Billboard Name" required
                                value={newBillboardData.name} onChange={e => setNewBillboardData({...newBillboardData, name: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <input type="text" className="form-input" placeholder="Location" required
                                value={newBillboardData.location} onChange={e => setNewBillboardData({...newBillboardData, location: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <select className="form-input" value={newBillboardData.type} onChange={e => setNewBillboardData({...newBillboardData, type: e.target.value})}>
                                    <option value="Digital">Digital</option>
                                    <option value="Static">Static</option>
                                </select>
                            </div>

                            {newBillboardData.type === 'Digital' ? (
                                <>
                                <div className="form-group">
                                    <input type="number" className="form-input" placeholder="Morning Price (₹)" 
                                    value={newBillboardData.slotPricing?.morning || ''} 
                                    onChange={e => setNewBillboardData({
                                        ...newBillboardData, 
                                        slotPricing: { ...newBillboardData.slotPricing, morning: e.target.value }
                                    })} />
                                </div>
                                <div className="form-group">
                                    <input type="number" className="form-input" placeholder="Afternoon Price (₹)" 
                                    value={newBillboardData.slotPricing?.afternoon || ''} 
                                    onChange={e => setNewBillboardData({
                                        ...newBillboardData, 
                                        slotPricing: { ...newBillboardData.slotPricing, afternoon: e.target.value }
                                    })} />
                                </div>
                                <div className="form-group">
                                    <input type="number" className="form-input" placeholder="Evening Price (₹)" 
                                    value={newBillboardData.slotPricing?.evening || ''} 
                                    onChange={e => setNewBillboardData({
                                        ...newBillboardData, 
                                        slotPricing: { ...newBillboardData.slotPricing, evening: e.target.value }
                                    })} />
                                </div>
                                <div className="form-group">
                                    <input type="number" className="form-input" placeholder="Night Price (₹)" 
                                    value={newBillboardData.slotPricing?.night || ''} 
                                    onChange={e => setNewBillboardData({
                                        ...newBillboardData, 
                                        slotPricing: { ...newBillboardData.slotPricing, night: e.target.value }
                                    })} />
                                </div>
                                </>
                            ) : (
                                <div className="form-group">
                                <input type="number" className="form-input" placeholder="Price per Day" required
                                    value={newBillboardData.price} onChange={e => setNewBillboardData({...newBillboardData, price: e.target.value})} />
                                </div>
                            )}

                            <div className="form-group">
                                <input type="text" className="form-input" placeholder="Dimensions"
                                value={newBillboardData.dimensions} onChange={e => setNewBillboardData({...newBillboardData, dimensions: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <input type="text" className="form-input" placeholder="Footfall"
                                value={newBillboardData.dailyFootfall} onChange={e => setNewBillboardData({...newBillboardData, dailyFootfall: e.target.value})} />
                            </div>

                             <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                <textarea className="form-input" placeholder="Description" rows="2"
                                value={newBillboardData.description} onChange={e => setNewBillboardData({...newBillboardData, description: e.target.value})}></textarea>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                            <button type="button" className="btn-secondary" onClick={() => setIsAddingBillboard(false)}>Cancel</button>
                            <button type="button" className="btn-primary" onClick={handleAddBillboardToNewOwner}>Add to List</button>
                        </div>
                    </div>
                )}
            </div>
          </form>
        </div>

        {/* Status/Search Card */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Find Owner</h3>
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-input"
              placeholder="Search owners..."
            />
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="card" style={{ marginBottom: '30px', background: 'rgba(31, 111, 235, 0.1)', borderColor: 'rgba(31, 111, 235, 0.2)' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#58a6ff', fontSize: '14px' }}>
           Owner Credentials Management
        </h4>
        <p style={{ margin: 0, fontSize: '13px', color: '#8b949e' }}>
          Create credentials for billboard owners here. They will use these credentials to log in to their portal and manage their billboards.
        </p>
      </div>

      {/* List Section */}
      <div className="list-container">
        <div className="list-header">
          All Billboard Owners ({owners.length})
        </div>

        {loading ? (
          <div className="empty-state">Loading...</div>
        ) : owners.length > 0 ? (
          <table className="owner-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Username</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {owners.map((owner) => (
                <tr key={owner._id}>
                  <td>{owner.name || 'N/A'}</td>
                  <td>{owner.username}</td>
                  <td>{owner.phoneNumber || 'N/A'}</td>
                  <td>
                    <span style={{ textTransform: 'capitalize' }}>
                      {owner.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <span className="status-badge status-active">Active</span>
                  </td>
                  <td>
                    <button 
                      className="action-icon-btn" 
                      onClick={() => handleEditClick(owner)}
                      title="Edit Owner"
                    >
                      <Pencil size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <ClipboardList className="empty-icon" />
            <p>No billboard owners yet</p>
            <span style={{ fontSize: '12px' }}>Add your first owner above</span>
          </div>
        )}
      </div>
      {renderEditModal()}
    </>
  );

  return (
    <div className="dashboard-container">
      {renderSidebar()}
      
      <main className="main-content">
        <div className="top-bar">
          <div className="page-header">
            <h2>Billboard Management</h2>
            <p>Manage and track all platform entities</p>
          </div>
          <div className="header-actions">
            <button onClick={handleLogout} className="secure-logout">
              Secure Logout
            </button>
          </div>
        </div>

        {activeTab === 'billboard-owners' && renderBillboardOwnersContent()}
        
        {activeTab === 'new-requests' && renderNewRequestsContent()}

        {activeTab === 'business-owners' && renderBusinessOwnersContent()}

        {activeTab === 'running-ads' && renderRunningAdsContent()}
      </main>
    </div>
  );
}
