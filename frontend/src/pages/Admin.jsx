import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Plus, X, Check, AlertCircle, Trash2, Video, Play, Pause, Package, Truck, LayoutDashboard, CalendarDays } from 'lucide-react';
import { useApp } from '../context/AppContext';
import AdminOverview from '../components/admin/AdminOverview';
import AdminBookings from '../components/admin/AdminBookings';

export default function Admin() {
  const { addCar, addToast, cars, deleteCar, spareParts, addSparePart, deleteSparePart, towingVehicles, addTowingVehicle, deleteTowingVehicle } = useApp();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const videoFileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  const [step, setStep] = useState('form'); // 'form', 'camera', 'fleet', 'parts', 'towing'
  const [adminTab, setAdminTab] = useState('overview'); // 'overview', 'bookings', 'cars', 'parts', 'towing'
  const [capturedImage, setCapturedImage] = useState(null);
  const [mediaType, setMediaType] = useState('image'); // 'image' or 'video'
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [streamRef, setStreamRef] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [deleteConfirmParts, setDeleteConfirmParts] = useState(null);
  const [deleteConfirmTowing, setDeleteConfirmTowing] = useState(null);
  const [capturedImageParts, setCapturedImageParts] = useState(null);
  const [capturedImageTowing, setCapturedImageTowing] = useState(null);

  const [form, setForm] = useState({
    name: '',
    brand: '',
    category: 'Luxury',
    price: '',
    priceWeek: '',
    seats: '',
    doors: '',
    transmission: 'Automatic',
    fuel: 'Petrol',
    year: new Date().getFullYear(),
    engine: '',
    power: '',
    topSpeed: '',
    acceleration: '',
    features: '',
    description: '',
    location: 'Accra',
    tag: '',
    rating: 4.8,
    reviews: 0,
    mileage: 'Unlimited',
  });

  // Spare Parts Form State
  const [partsForm, setPartsForm] = useState({
    name: '',
    category: 'Engine',
    price: '',
    priceGHS: '',
    brand: '',
    description: '',
    quantity: '',
    rating: 4.5,
    reviews: 0,
  });

  // Towing Vehicles Form State
  const [towingForm, setTowingForm] = useState({
    name: '',
    brand: '',
    towCapacity: '',
    price: '',
    priceGHS: '',
    operator: '',
    phone: '',
    experience: '',
    tag: 'Economy',
    description: '',
    rating: 4.7,
    reviews: 0,
  });

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (streamRef) {
        streamRef.getTracks().forEach(track => track.stop());
      }
    };
  }, [streamRef]);

  const startCamera = async () => {
    try {
      // Check if getUserMedia is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        addToast('Camera not supported in this browser', 'error');
        return;
      }

      const constraints = {
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: mediaType === 'video' // Only request audio for video recording
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setStreamRef(stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Set up media recorder for video recording
        if (mediaType === 'video') {
          try {
            const mimeType = 'video/webm;codecs=vp9,opus';
            const isSupported = MediaRecorder.isTypeSupported(mimeType);
            const options = { mimeType: isSupported ? mimeType : 'video/webm' };
            mediaRecorderRef.current = new MediaRecorder(stream, options);
            
            mediaRecorderRef.current.ondataavailable = (e) => {
              if (e.data.size > 0) {
                setRecordedChunks(prev => [...prev, e.data]);
              }
            };
          } catch (err) {
            console.error('MediaRecorder setup error:', err);
          }
        }
        
        // Ensure video plays after metadata is loaded
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsCameraActive(true);
            })
            .catch(err => {
              console.error('Error playing video:', err);
              addToast('Error starting camera playback', 'error');
            });
        } else {
          setIsCameraActive(true);
        }
      }
    } catch (err) {
      console.error('Camera error:', err);
      
      // Provide specific error messages
      let errorMessage = 'Camera access denied';
      
      if (err.name === 'NotAllowedError') {
        errorMessage = 'Camera permission denied. Please allow camera access in your browser settings.';
      } else if (err.name === 'NotFoundError') {
        errorMessage = 'No camera device found. Please check your device.';
      } else if (err.name === 'NotReadableError') {
        errorMessage = 'Camera is already in use by another application.';
      } else if (err.name === 'SecurityError') {
        errorMessage = 'Camera access requires HTTPS. Please use a secure connection.';
      }
      
      addToast(errorMessage, 'error');
    }
  };

  const stopCamera = () => {
    if (streamRef) {
      streamRef.getTracks().forEach(track => track.stop());
      setStreamRef(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setIsRecording(false);
  };

  const startRecording = () => {
    if (mediaRecorderRef.current && !isRecording) {
      setRecordedChunks([]);
      mediaRecorderRef.current.start();
      setIsRecording(true);
      addToast('Recording started...', 'success');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Wait for the last data to be collected
      setTimeout(() => {
        mediaRecorderRef.current.onstop = () => {
          if (recordedChunks.length > 0) {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            setUploadedVideo(url);
            stopCamera();
            addToast('Video recorded successfully!', 'success');
          }
        };
      }, 100);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) {
      addToast('Camera not ready', 'error');
      return;
    }
    
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Wait for video to be ready
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        addToast('Camera is still loading, please wait a moment', 'error');
        return;
      }
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const image = canvas.toDataURL('image/jpeg', 0.95);
      setCapturedImage(image);
      stopCamera();
      addToast('Photo captured successfully!', 'success');
    } catch (err) {
      console.error('Capture error:', err);
      addToast('Failed to capture photo', 'error');
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setCapturedImage(evt.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 100MB)
      if (file.size > 100 * 1024 * 1024) {
        addToast('Video file is too large. Maximum size is 100MB.', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (evt) => {
        setUploadedVideo(evt.target.result);
        addToast('Video uploaded successfully!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  // Parts Form Handlers
  const handlePartsInputChange = (e) => {
    const { name, value } = e.target;
    setPartsForm(f => ({ ...f, [name]: name === 'price' || name === 'priceGHS' || name === 'quantity' || name === 'rating' || name === 'reviews' ? (value ? parseInt(value) : '') : value }));
  };

  const handlePartsSubmit = (e) => {
    e.preventDefault();
    if (!partsForm.name || !partsForm.category || !partsForm.price || !capturedImageParts) {
      addToast('Please fill all required fields and capture an image', 'error');
      return;
    }

    const newPart = {
      name: partsForm.name,
      category: partsForm.category,
      price: parseInt(partsForm.price),
      priceGHS: parseInt(partsForm.priceGHS) || parseInt(partsForm.price) * 10,
      brand: partsForm.brand,
      image: capturedImageParts,
      description: partsForm.description,
      quantity: parseInt(partsForm.quantity) || 0,
      rating: partsForm.rating,
      reviews: parseInt(partsForm.reviews) || 0,
      inStock: parseInt(partsForm.quantity) > 0,
    };

    addSparePart(newPart);

    // Reset form
    setPartsForm({
      name: '',
      category: 'Engine',
      price: '',
      priceGHS: '',
      brand: '',
      description: '',
      quantity: '',
      rating: 4.5,
      reviews: 0,
    });
    setCapturedImageParts(null);
    setStep('form');
    addToast('Spare part added successfully!', 'success');
  };

  // Towing Form Handlers
  const handleTowingInputChange = (e) => {
    const { name, value } = e.target;
    setTowingForm(f => ({ ...f, [name]: name === 'price' || name === 'priceGHS' || name === 'rating' || name === 'reviews' ? (value ? parseInt(value) : '') : value }));
  };

  const handleTowingSubmit = (e) => {
    e.preventDefault();
    if (!towingForm.name || !towingForm.brand || !towingForm.towCapacity || !towingForm.price || !capturedImageTowing) {
      addToast('Please fill all required fields and capture an image', 'error');
      return;
    }

    const newTowingVehicle = {
      name: towingForm.name,
      brand: towingForm.brand,
      category: 'Towing',
      image: capturedImageTowing,
      images: [capturedImageTowing, capturedImageTowing, capturedImageTowing, capturedImageTowing, capturedImageTowing, capturedImageTowing],
      towCapacity: towingForm.towCapacity,
      price: parseInt(towingForm.price),
      priceGHS: parseInt(towingForm.priceGHS) || parseInt(towingForm.price) * 10,
      operator: towingForm.operator,
      phone: towingForm.phone,
      experience: towingForm.experience,
      tag: towingForm.tag,
      description: towingForm.description,
      rating: towingForm.rating,
      reviews: parseInt(towingForm.reviews) || 0,
      available: true,
      location: 'Accra',
      features: ['Hydraulic Lift', 'Safety Equipment', 'GPS Tracking', 'LED Lighting'],
    };

    addTowingVehicle(newTowingVehicle);

    // Reset form
    setTowingForm({
      name: '',
      brand: '',
      towCapacity: '',
      price: '',
      priceGHS: '',
      operator: '',
      phone: '',
      experience: '',
      tag: 'Economy',
      description: '',
      rating: 4.7,
      reviews: 0,
    });
    setCapturedImageTowing(null);
    setStep('form');
    addToast('Towing vehicle added successfully!', 'success');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: name === 'price' || name === 'priceWeek' || name === 'seats' || name === 'doors' || name === 'year' || name === 'rating' || name === 'reviews' ? (value ? parseInt(value) : '') : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation - accept either image or video
    const mediaContent = mediaType === 'image' ? capturedImage : uploadedVideo;
    
    if (!form.name || !form.brand || !form.price || !mediaContent) {
      addToast('Please fill all required fields and capture/upload an image or video', 'error');
      return;
    }

    // For videos, create a thumbnail from first frame if possible
    let thumbnail = mediaContent;
    if (mediaType === 'video') {
      // Use a generic video placeholder as thumbnail
      thumbnail = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23222" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="24" fill="%23666" font-family="Arial"%3E📹 Video Available%3C/text%3E%3C/svg%3E';
    }

    // Create images array with the media content
    const images = [mediaContent, mediaContent, mediaContent, mediaContent, mediaContent, mediaContent];

    const newCar = {
      name: form.name,
      brand: form.brand,
      category: form.category,
      image: thumbnail,
      images,
      video: mediaType === 'video' ? mediaContent : null,
      mediaType: mediaType,
      price: parseInt(form.price),
      priceWeek: parseInt(form.priceWeek) || form.price * 6,
      rating: form.rating,
      reviews: parseInt(form.reviews) || 0,
      seats: parseInt(form.seats) || 5,
      doors: parseInt(form.doors) || 4,
      transmission: form.transmission,
      fuel: form.fuel,
      mileage: form.mileage,
      year: form.year,
      engine: form.engine,
      power: form.power,
      topSpeed: form.topSpeed,
      acceleration: form.acceleration,
      features: form.features.split(',').map(f => f.trim()).filter(f => f),
      description: form.description,
      available: true,
      location: form.location,
      tag: form.tag,
    };

    addCar(newCar);

    // Reset form
    setForm({
      name: '',
      brand: '',
      category: 'Luxury',
      price: '',
      priceWeek: '',
      seats: '',
      doors: '',
      transmission: 'Automatic',
      fuel: 'Petrol',
      year: new Date().getFullYear(),
      engine: '',
      power: '',
      topSpeed: '',
      acceleration: '',
      features: '',
      description: '',
      location: 'Accra',
      tag: '',
      rating: 4.8,
      reviews: 0,
      mileage: 'Unlimited',
    });
    setCapturedImage(null);
    setUploadedVideo(null);
    setMediaType('image');
    setStep('form');
    addToast(`Vehicle added successfully with ${mediaType}!`, 'success');
  };

  const handleDeleteCar = (carId, carName) => {
    setDeleteConfirm(null);
    deleteCar(carId);
  };

  return (
    <main>
      <div className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <span>Dashboard</span>
            <span>/</span>
            <span className="active">Add New Car</span>
          </div>
          <h1>Admin Dashboard</h1>
          <p>Upload new car images and add vehicle details to the fleet.</p>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px' }}>
        <div className="admin-layout">
          {/* Form */}
          <div className="admin-form">
            <div className="admin-card">
              <h2>Admin Dashboard</h2>

              {/* Main Tabs */}
              <div className="admin-tabs-main">
                <button className={`admin-tab-main${adminTab === 'overview' ? ' active' : ''}`} onClick={() => setAdminTab('overview')}>
                  <LayoutDashboard size={16} /> Overview
                </button>
                <button className={`admin-tab-main${adminTab === 'bookings' ? ' active' : ''}`} onClick={() => setAdminTab('bookings')}>
                  <CalendarDays size={16} /> Bookings
                </button>
                <button className={`admin-tab-main${adminTab === 'cars' ? ' active' : ''}`} onClick={() => { setAdminTab('cars'); setStep('form'); }}>
                  🚗 Rental Cars
                </button>
                <button className={`admin-tab-main${adminTab === 'parts' ? ' active' : ''}`} onClick={() => { setAdminTab('parts'); setStep('form'); }}>
                  <Package size={16} /> Spare Parts
                </button>
                <button className={`admin-tab-main${adminTab === 'towing' ? ' active' : ''}`} onClick={() => { setAdminTab('towing'); setStep('form'); }}>
                  <Truck size={16} /> Towing Services
                </button>
              </div>

              {adminTab === 'overview' && <AdminOverview />}

              {adminTab === 'bookings' && <AdminBookings />}

              {adminTab === 'cars' && (
                <>
                  {/* Sub-Tabs for Cars */}
                  <div className="admin-tabs">
                    <button className={`admin-tab${step === 'form' ? ' active' : ''}`} onClick={() => setStep('form')}>
                      Vehicle Details
                    </button>
                    <button className={`admin-tab${step === 'camera' ? ' active' : ''}`} onClick={() => setStep('camera')}>
                      Capture Image
                    </button>
                    <button className={`admin-tab${step === 'fleet' ? ' active' : ''}`} onClick={() => setStep('fleet')}>
                      Manage Fleet
                    </button>
                  </div>

                  {/* Camera/Upload for Cars */}
                  {step === 'camera' && (
                <div className="camera-section">
                  {/* Media Type Selection */}
                  <div className="media-type-selector">
                    <button
                      type="button"
                      className={`media-type-btn${mediaType === 'image' ? ' active' : ''}`}
                      onClick={() => {
                        setMediaType('image');
                        setCapturedImage(null);
                        setUploadedVideo(null);
                        stopCamera();
                      }}
                    >
                      <Camera size={18} /> Photo
                    </button>
                    <button
                      type="button"
                      className={`media-type-btn${mediaType === 'video' ? ' active' : ''}`}
                      onClick={() => {
                        setMediaType('video');
                        setCapturedImage(null);
                        setUploadedVideo(null);
                        stopCamera();
                      }}
                    >
                      <Video size={18} /> Video
                    </button>
                  </div>

                  <div className="camera-container">
                    {/* Image Mode */}
                    {mediaType === 'image' && (
                      <>
                        {!isCameraActive && !capturedImage && (
                          <div className="camera-placeholder">
                            <Camera size={48} />
                            <div>
                              <button type="button" className="btn btn-primary btn-lg" onClick={startCamera} style={{ marginRight: 12 }}>
                                <Camera size={16} /> Start Camera
                              </button>
                              <button type="button" className="btn btn-secondary btn-lg" onClick={() => fileInputRef.current?.click()}>
                                <Upload size={16} /> Upload Photo
                              </button>
                              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileSelect} style={{ display: 'none' }} />
                            </div>
                          </div>
                        )}

                        {isCameraActive && !capturedImage && (
                          <div className="camera-live">
                            <video 
                              ref={videoRef} 
                              autoPlay 
                              playsInline 
                              muted
                              disablePictureInPicture
                              style={{ width: '100%', borderRadius: 'var(--radius-lg)', display: 'block' }} 
                            />
                            <div className="camera-controls">
                              <button type="button" className="btn btn-primary" onClick={capturePhoto}>
                                <Camera size={18} /> Capture Photo
                              </button>
                              <button type="button" className="btn btn-secondary" onClick={stopCamera}>
                                <X size={18} /> Cancel
                              </button>
                            </div>
                          </div>
                        )}

                        {capturedImage && (
                          <div className="captured-image">
                            <img src={capturedImage} alt="Captured" style={{ width: '100%', borderRadius: 'var(--radius-lg)' }} />
                            <div className="image-actions">
                              <button type="button" className="btn btn-success">
                                <Check size={18} /> Use This Photo
                              </button>
                              <button type="button" className="btn btn-secondary" onClick={retakePhoto}>
                                <Camera size={18} /> Retake
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {/* Video Mode */}
                    {mediaType === 'video' && (
                      <>
                        {!isCameraActive && !uploadedVideo && (
                          <div className="camera-placeholder">
                            <Video size={48} />
                            <div>
                              <button type="button" className="btn btn-primary btn-lg" onClick={startCamera} style={{ marginRight: 12 }}>
                                <Video size={16} /> Start Recording
                              </button>
                              <button type="button" className="btn btn-secondary btn-lg" onClick={() => videoFileInputRef.current?.click()}>
                                <Upload size={16} /> Upload Video
                              </button>
                              <input type="file" accept="video/*" ref={videoFileInputRef} onChange={handleVideoUpload} style={{ display: 'none' }} />
                            </div>
                          </div>
                        )}

                        {isCameraActive && !uploadedVideo && (
                          <div className="camera-live">
                            <video 
                              ref={videoRef} 
                              autoPlay 
                              playsInline 
                              muted
                              disablePictureInPicture
                              style={{ width: '100%', borderRadius: 'var(--radius-lg)', display: 'block', background: '#000' }} 
                            />
                            <div className={`recording-indicator${isRecording ? ' active' : ''}`}>
                              {isRecording && <span className="rec-dot" />}
                              {isRecording ? 'Recording...' : 'Ready to record'}
                            </div>
                            <div className="camera-controls">
                              {!isRecording ? (
                                <button type="button" className="btn btn-danger" onClick={startRecording}>
                                  <Play size={18} /> Start Recording
                                </button>
                              ) : (
                                <button type="button" className="btn btn-warning" onClick={stopRecording}>
                                  <Pause size={18} /> Stop Recording
                                </button>
                              )}
                              <button type="button" className="btn btn-secondary" onClick={stopCamera} disabled={isRecording}>
                                <X size={18} /> Cancel
                              </button>
                            </div>
                          </div>
                        )}

                        {uploadedVideo && (
                          <div className="captured-image">
                            <video 
                              src={uploadedVideo} 
                              controls 
                              style={{ width: '100%', borderRadius: 'var(--radius-lg)', maxHeight: 400 }} 
                            />
                            <div className="image-actions">
                              <button type="button" className="btn btn-success">
                                <Check size={18} /> Use This Video
                              </button>
                              <button type="button" className="btn btn-secondary" onClick={() => setUploadedVideo(null)}>
                                <X size={18} /> Remove
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  <button type="button" className="btn btn-outline btn-block" onClick={() => setStep('form')} style={{ marginTop: 16 }}>
                    Continue to Details
                  </button>
                </div>
              )}

              {/* Fleet Management */}
              {step === 'fleet' && (
                <div className="fleet-section">
                  <h3 style={{ marginBottom: 20 }}>Current Fleet ({cars.length} vehicles)</h3>
                  {cars.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--gray-1)' }}>
                      <p>No vehicles in fleet yet. Start by adding a new vehicle.</p>
                    </div>
                  ) : (
                    <div className="fleet-grid">
                      {cars.map(car => (
                        <div key={car.id} className="fleet-card">
                          <div className="fleet-image">
                            {car.mediaType === 'video' && car.video ? (
                              <div className="fleet-video-wrap">
                                <video 
                                  src={car.video} 
                                  controls
                                  style={{ width: '100%', height: '100%', objectFit: 'cover', background: '#000' }}
                                />
                                <div className="video-badge">📹 VIDEO</div>
                              </div>
                            ) : (
                              <img src={car.image} alt={car.name} />
                            )}
                            <div className="fleet-overlay">
                              <button
                                className="btn btn-danger"
                                onClick={() => setDeleteConfirm(car.id)}
                                title="Delete this car"
                              >
                                <Trash2 size={16} /> Delete
                              </button>
                            </div>
                          </div>
                          <div className="fleet-info">
                            <div className="fleet-name">{car.brand} {car.name}</div>
                            <div className="fleet-meta">
                              <span>{car.year}</span>
                              <span>•</span>
                              <span>{car.category}</span>
                              {car.mediaType === 'video' && <span>• 📹</span>}
                            </div>
                            <div className="fleet-price">GHS {car.price}/day</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Delete Confirmation Modal */}
              {deleteConfirm && (
                <div style={{
                  position: 'fixed',
                  inset: 0,
                  background: 'rgba(0,0,0,0.7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1000,
                }}>
                  <div style={{
                    background: 'var(--dark-2)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 24,
                    maxWidth: 400,
                    textAlign: 'center',
                  }}>
                    <AlertCircle size={48} style={{ color: 'var(--primary)', marginBottom: 16, margin: 'auto' }} />
                    <h3 style={{ marginBottom: 8 }}>Delete Vehicle?</h3>
                    <p style={{ color: 'var(--gray-1)', marginBottom: 24 }}>
                      Are you sure you want to remove this vehicle from the fleet? This action cannot be undone.
                    </p>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <button className="btn btn-secondary btn-lg" onClick={() => setDeleteConfirm(null)} style={{ flex: 1 }}>
                        Cancel
                      </button>
                      <button
                        className="btn btn-danger btn-lg"
                        onClick={() => handleDeleteCar(deleteConfirm)}
                        style={{ flex: 1 }}
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Fields */}
              {step === 'form' && (
                <form onSubmit={handleSubmit} className="admin-form-fields">
                  {/* Basic Info */}
                  <div className="form-section">
                    <h3>Basic Information *</h3>
                    <div className="grid grid-2">
                      <div className="form-group">
                        <label className="form-label">Car Name *</label>
                        <input type="text" className="form-control" name="name" placeholder="e.g., BMW 5 Series" value={form.name} onChange={handleInputChange} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Brand *</label>
                        <input type="text" className="form-control" name="brand" placeholder="e.g., BMW" value={form.brand} onChange={handleInputChange} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Category</label>
                        <select className="form-control" name="category" value={form.category} onChange={handleInputChange}>
                          <option>Luxury</option>
                          <option>Electric</option>
                          <option>Sports</option>
                          <option>SUV</option>
                          <option>Economy</option>
                          <option>Van</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Location</label>
                        <select className="form-control" name="location" value={form.location} onChange={handleInputChange}>
                          <option>Accra</option>
                          <option>Kumasi</option>
                          <option>Takoradi</option>
                          <option>Tema</option>
                          <option>Sekondi</option>
                          <option>Cape Coast</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="form-section">
                    <h3>Pricing *</h3>
                    <div className="grid grid-2">
                      <div className="form-group">
                        <label className="form-label">Daily Rate (GHS) *</label>
                        <input type="number" className="form-control" name="price" placeholder="120" value={form.price} onChange={handleInputChange} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Weekly Rate (GHS)</label>
                        <input type="number" className="form-control" name="priceWeek" placeholder="700" value={form.priceWeek} onChange={handleInputChange} />
                      </div>
                    </div>
                  </div>

                  {/* Specs */}
                  <div className="form-section">
                    <h3>Specifications</h3>
                    <div className="grid grid-3">
                      <div className="form-group">
                        <label className="form-label">Seats</label>
                        <input type="number" className="form-control" name="seats" placeholder="5" value={form.seats} onChange={handleInputChange} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Doors</label>
                        <input type="number" className="form-control" name="doors" placeholder="4" value={form.doors} onChange={handleInputChange} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Year</label>
                        <input type="number" className="form-control" name="year" placeholder="2024" value={form.year} onChange={handleInputChange} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Transmission</label>
                        <select className="form-control" name="transmission" value={form.transmission} onChange={handleInputChange}>
                          <option>Automatic</option>
                          <option>Manual</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Fuel Type</label>
                        <select className="form-control" name="fuel" value={form.fuel} onChange={handleInputChange}>
                          <option>Petrol</option>
                          <option>Diesel</option>
                          <option>Electric</option>
                          <option>Hybrid</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Mileage</label>
                        <input type="text" className="form-control" name="mileage" placeholder="Unlimited" value={form.mileage} onChange={handleInputChange} />
                      </div>
                    </div>
                  </div>

                  {/* Performance */}
                  <div className="form-section">
                    <h3>Performance Details</h3>
                    <div className="grid grid-2">
                      <div className="form-group">
                        <label className="form-label">Engine</label>
                        <input type="text" className="form-control" name="engine" placeholder="3.0L Inline-6" value={form.engine} onChange={handleInputChange} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Power</label>
                        <input type="text" className="form-control" name="power" placeholder="335 hp" value={form.power} onChange={handleInputChange} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Top Speed</label>
                        <input type="text" className="form-control" name="topSpeed" placeholder="250 km/h" value={form.topSpeed} onChange={handleInputChange} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">0-100 km/h</label>
                        <input type="text" className="form-control" name="acceleration" placeholder="5.1s" value={form.acceleration} onChange={handleInputChange} />
                      </div>
                    </div>
                  </div>

                  {/* Features & Description */}
                  <div className="form-section">
                    <h3>Features & Description</h3>
                    <div className="form-group">
                      <label className="form-label">Features (comma-separated)</label>
                      <textarea className="form-control" name="features" placeholder="Leather Seats, Navigation, Bluetooth, Backup Camera" value={form.features} onChange={handleInputChange} style={{ minHeight: 80 }} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Description</label>
                      <textarea className="form-control" name="description" placeholder="Brief description of the vehicle..." value={form.description} onChange={handleInputChange} style={{ minHeight: 100 }} />
                    </div>
                    <div className="grid grid-2">
                      <div className="form-group">
                        <label className="form-label">Initial Rating</label>
                        <input type="number" className="form-control" name="rating" placeholder="4.8" step="0.1" min="0" max="5" value={form.rating} onChange={handleInputChange} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Review Count</label>
                        <input type="number" className="form-control" name="reviews" placeholder="0" value={form.reviews} onChange={handleInputChange} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Tag (e.g., Most Popular, New Arrival)</label>
                      <input type="text" className="form-control" name="tag" placeholder="Most Popular" value={form.tag} onChange={handleInputChange} />
                    </div>
                  </div>

                  {/* Image reminder */}
                  {mediaType === 'image' && !capturedImage && (
                    <div className="info-box warning">
                      <AlertCircle size={18} />
                      <span>Please capture or upload a photo before submitting.</span>
                    </div>
                  )}

                  {mediaType === 'video' && !uploadedVideo && (
                    <div className="info-box warning">
                      <AlertCircle size={18} />
                      <span>Please record or upload a video before submitting.</span>
                    </div>
                  )}

                  {capturedImage && mediaType === 'image' && (
                    <div className="info-box success">
                      <Check size={18} />
                      <span>Photo captured successfully and will be used for this vehicle.</span>
                    </div>
                  )}

                  {uploadedVideo && mediaType === 'video' && (
                    <div className="info-box success">
                      <Check size={18} />
                      <span>Video uploaded successfully and will be used for this vehicle.</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: 12 }}>
                    <button type="button" className="btn btn-secondary" onClick={() => setStep('camera')} style={{ flex: 1 }}>
                      {mediaType === 'image' ? <Camera size={16} /> : <Video size={16} />} 
                      {mediaType === 'image' ? ' Change Photo' : ' Change Video'}
                    </button>
                    <button type="submit" className="btn btn-primary btn-lg" style={{ flex: 1 }} disabled={!capturedImage && !uploadedVideo}>
                      <Plus size={16} /> Add Vehicle to Fleet
                    </button>
                  </div>
                </form>
              )}
                </>
              )}

              {/* SPARE PARTS TAB */}
              {adminTab === 'parts' && (
                <>
                  <div className="admin-tabs">
                    <button className={`admin-tab${step === 'form' ? ' active' : ''}`} onClick={() => setStep('form')}>
                      Part Details
                    </button>
                    <button className={`admin-tab${step === 'camera' ? ' active' : ''}`} onClick={() => setStep('camera')}>
                      Capture Image
                    </button>
                    <button className={`admin-tab${step === 'fleet' ? ' active' : ''}`} onClick={() => setStep('fleet')}>
                      Manage Parts
                    </button>
                  </div>

                  {step === 'camera' && (
                    <div className="camera-section">
                      <div className="camera-container">
                        {!isCameraActive && !capturedImageParts && (
                          <div className="camera-placeholder">
                            <Camera size={48} />
                            <div>
                              <button type="button" className="btn btn-primary btn-lg" onClick={startCamera} style={{ marginRight: 12 }}>
                                <Camera size={16} /> Start Camera
                              </button>
                              <button type="button" className="btn btn-secondary btn-lg" onClick={() => fileInputRef.current?.click()}>
                                <Upload size={16} /> Upload Photo
                              </button>
                              <input type="file" accept="image/*" ref={fileInputRef} onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (evt) => setCapturedImageParts(evt.target?.result);
                                  reader.readAsDataURL(file);
                                }
                              }} style={{ display: 'none' }} />
                            </div>
                          </div>
                        )}

                        {isCameraActive && !capturedImageParts && (
                          <div className="camera-live">
                            <video ref={videoRef} autoPlay playsInline muted disablePictureInPicture style={{ width: '100%', borderRadius: 'var(--radius-lg)', display: 'block' }} />
                            <div className="camera-controls">
                              <button type="button" className="btn btn-primary" onClick={capturePhoto}>
                                <Camera size={18} /> Capture Photo
                              </button>
                              <button type="button" className="btn btn-secondary" onClick={stopCamera}>
                                <X size={18} /> Cancel
                              </button>
                            </div>
                          </div>
                        )}

                        {capturedImageParts && (
                          <div className="captured-image">
                            <img src={capturedImageParts} alt="Captured" style={{ width: '100%', borderRadius: 'var(--radius-lg)' }} />
                            <div className="image-actions">
                              <button type="button" className="btn btn-success">
                                <Check size={18} /> Use This Photo
                              </button>
                              <button type="button" className="btn btn-secondary" onClick={() => setCapturedImageParts(null)}>
                                <Camera size={18} /> Retake
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                      <button type="button" className="btn btn-outline btn-block" onClick={() => setStep('form')} style={{ marginTop: 16 }}>
                        Continue to Details
                      </button>
                    </div>
                  )}

                  {step === 'form' && (
                    <form onSubmit={handlePartsSubmit} className="admin-form-fields">
                      <div className="form-section">
                        <h3>Part Information *</h3>
                        <div className="grid grid-2">
                          <div className="form-group">
                            <label className="form-label">Part Name *</label>
                            <input type="text" className="form-control" name="name" placeholder="e.g., Air Filter" value={partsForm.name} onChange={handlePartsInputChange} required />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Brand *</label>
                            <input type="text" className="form-control" name="brand" placeholder="e.g., Bosch" value={partsForm.brand} onChange={handlePartsInputChange} required />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Category *</label>
                            <select className="form-control" name="category" value={partsForm.category} onChange={handlePartsInputChange} required>
                              <option>Engine</option>
                              <option>Brakes</option>
                              <option>Suspension</option>
                              <option>Electrical</option>
                              <option>Cooling</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <label className="form-label">Quantity In Stock</label>
                            <input type="number" className="form-control" name="quantity" placeholder="50" value={partsForm.quantity} onChange={handlePartsInputChange} />
                          </div>
                        </div>
                      </div>

                      <div className="form-section">
                        <h3>Pricing *</h3>
                        <div className="grid grid-2">
                          <div className="form-group">
                            <label className="form-label">Price (GHS) *</label>
                            <input type="number" className="form-control" name="priceGHS" placeholder="450" value={partsForm.priceGHS} onChange={handlePartsInputChange} required />
                          </div>
                        </div>
                      </div>

                      <div className="form-section">
                        <h3>Details</h3>
                        <div className="form-group">
                          <label className="form-label">Description</label>
                          <textarea className="form-control" name="description" placeholder="Describe the spare part..." value={partsForm.description} onChange={handlePartsInputChange} style={{ minHeight: 100 }} />
                        </div>
                        <div className="grid grid-2">
                          <div className="form-group">
                            <label className="form-label">Rating</label>
                            <input type="number" className="form-control" name="rating" placeholder="4.5" step="0.1" min="0" max="5" value={partsForm.rating} onChange={handlePartsInputChange} />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Review Count</label>
                            <input type="number" className="form-control" name="reviews" placeholder="0" value={partsForm.reviews} onChange={handlePartsInputChange} />
                          </div>
                        </div>
                      </div>

                      {!capturedImageParts && (
                        <div className="info-box warning">
                          <AlertCircle size={18} />
                          <span>Please capture or upload a photo before submitting.</span>
                        </div>
                      )}

                      {capturedImageParts && (
                        <div className="info-box success">
                          <Check size={18} />
                          <span>Photo captured successfully.</span>
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: 12 }}>
                        <button type="button" className="btn btn-secondary" onClick={() => setStep('camera')} style={{ flex: 1 }}>
                          <Camera size={16} /> Change Photo
                        </button>
                        <button type="submit" className="btn btn-primary btn-lg" style={{ flex: 1 }} disabled={!capturedImageParts}>
                          <Plus size={16} /> Add Spare Part
                        </button>
                      </div>
                    </form>
                  )}

                  {step === 'fleet' && (
                    <div className="fleet-section">
                      <h3 style={{ marginBottom: 20 }}>Spare Parts Catalog ({spareParts.length} items)</h3>
                      {spareParts.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--gray-1)' }}>
                          <p>No spare parts in catalog yet. Start by adding a new part.</p>
                        </div>
                      ) : (
                        <div className="fleet-grid">
                          {spareParts.map(part => (
                            <div key={part.id} className="fleet-card">
                              <div className="fleet-image">
                                <img src={part.image} alt={part.name} />
                                <div className="fleet-overlay">
                                  <button className="btn btn-danger" onClick={() => setDeleteConfirmParts(part.id)} title="Delete this part">
                                    <Trash2 size={16} /> Delete
                                  </button>
                                </div>
                              </div>
                              <div className="fleet-info">
                                <div className="fleet-name">{part.name}</div>
                                <div className="fleet-meta">
                                  <span>{part.category}</span>
                                  <span>•</span>
                                  <span>{part.brand}</span>
                                </div>
                                <div className="fleet-price">GHS {part.priceGHS}</div>
                                <div style={{ fontSize: 12, color: 'var(--gray-1)', marginTop: 6 }}>Stock: {part.quantity}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {deleteConfirmParts && (
                    <div style={{
                      position: 'fixed',
                      inset: 0,
                      background: 'rgba(0,0,0,0.7)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 1000,
                    }}>
                      <div style={{
                        background: 'var(--dark-2)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-lg)',
                        padding: 24,
                        maxWidth: 400,
                        textAlign: 'center',
                      }}>
                        <AlertCircle size={48} style={{ color: 'var(--primary)', marginBottom: 16, margin: 'auto' }} />
                        <h3 style={{ marginBottom: 8 }}>Delete Spare Part?</h3>
                        <p style={{ color: 'var(--gray-1)', marginBottom: 24 }}>
                          Are you sure you want to remove this part from the catalog?
                        </p>
                        <div style={{ display: 'flex', gap: 12 }}>
                          <button className="btn btn-secondary btn-lg" onClick={() => setDeleteConfirmParts(null)} style={{ flex: 1 }}>
                            Cancel
                          </button>
                          <button className="btn btn-danger btn-lg" onClick={() => { deleteSparePart(deleteConfirmParts); setDeleteConfirmParts(null); }} style={{ flex: 1 }}>
                            <Trash2 size={16} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* TOWING SERVICES TAB */}
              {adminTab === 'towing' && (
                <>
                  <div className="admin-tabs">
                    <button className={`admin-tab${step === 'form' ? ' active' : ''}`} onClick={() => setStep('form')}>
                      Vehicle Details
                    </button>
                    <button className={`admin-tab${step === 'camera' ? ' active' : ''}`} onClick={() => setStep('camera')}>
                      Capture Image
                    </button>
                    <button className={`admin-tab${step === 'fleet' ? ' active' : ''}`} onClick={() => setStep('fleet')}>
                      Manage Fleet
                    </button>
                  </div>

                  {step === 'camera' && (
                    <div className="camera-section">
                      <div className="camera-container">
                        {!isCameraActive && !capturedImageTowing && (
                          <div className="camera-placeholder">
                            <Camera size={48} />
                            <div>
                              <button type="button" className="btn btn-primary btn-lg" onClick={startCamera} style={{ marginRight: 12 }}>
                                <Camera size={16} /> Start Camera
                              </button>
                              <button type="button" className="btn btn-secondary btn-lg" onClick={() => fileInputRef.current?.click()}>
                                <Upload size={16} /> Upload Photo
                              </button>
                              <input type="file" accept="image/*" ref={fileInputRef} onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (evt) => setCapturedImageTowing(evt.target?.result);
                                  reader.readAsDataURL(file);
                                }
                              }} style={{ display: 'none' }} />
                            </div>
                          </div>
                        )}

                        {isCameraActive && !capturedImageTowing && (
                          <div className="camera-live">
                            <video ref={videoRef} autoPlay playsInline muted disablePictureInPicture style={{ width: '100%', borderRadius: 'var(--radius-lg)', display: 'block' }} />
                            <div className="camera-controls">
                              <button type="button" className="btn btn-primary" onClick={capturePhoto}>
                                <Camera size={18} /> Capture Photo
                              </button>
                              <button type="button" className="btn btn-secondary" onClick={stopCamera}>
                                <X size={18} /> Cancel
                              </button>
                            </div>
                          </div>
                        )}

                        {capturedImageTowing && (
                          <div className="captured-image">
                            <img src={capturedImageTowing} alt="Captured" style={{ width: '100%', borderRadius: 'var(--radius-lg)' }} />
                            <div className="image-actions">
                              <button type="button" className="btn btn-success">
                                <Check size={18} /> Use This Photo
                              </button>
                              <button type="button" className="btn btn-secondary" onClick={() => setCapturedImageTowing(null)}>
                                <Camera size={18} /> Retake
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                      <button type="button" className="btn btn-outline btn-block" onClick={() => setStep('form')} style={{ marginTop: 16 }}>
                        Continue to Details
                      </button>
                    </div>
                  )}

                  {step === 'form' && (
                    <form onSubmit={handleTowingSubmit} className="admin-form-fields">
                      <div className="form-section">
                        <h3>Vehicle Information *</h3>
                        <div className="grid grid-2">
                          <div className="form-group">
                            <label className="form-label">Vehicle Name *</label>
                            <input type="text" className="form-control" name="name" placeholder="e.g., Heavy Duty Tow Truck" value={towingForm.name} onChange={handleTowingInputChange} required />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Brand *</label>
                            <input type="text" className="form-control" name="brand" placeholder="e.g., Volvo" value={towingForm.brand} onChange={handleTowingInputChange} required />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Tow Capacity *</label>
                            <input type="text" className="form-control" name="towCapacity" placeholder="e.g., 25 Tons" value={towingForm.towCapacity} onChange={handleTowingInputChange} required />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Service Type</label>
                            <select className="form-control" name="tag" value={towingForm.tag} onChange={handleTowingInputChange}>
                              <option>Economy</option>
                              <option>Premium</option>
                              <option>Emergency</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="form-section">
                        <h3>Pricing (GHS) *</h3>
                        <div className="form-group">
                          <label className="form-label">Price per Hour (GHS) *</label>
                          <input type="number" className="form-control" name="priceGHS" placeholder="1200" value={towingForm.priceGHS} onChange={handleTowingInputChange} required />
                        </div>
                      </div>

                      <div className="form-section">
                        <h3>Operator Information</h3>
                        <div className="grid grid-2">
                          <div className="form-group">
                            <label className="form-label">Operator Name</label>
                            <input type="text" className="form-control" name="operator" placeholder="John Mensah" value={towingForm.operator} onChange={handleTowingInputChange} />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Phone Number</label>
                            <input type="tel" className="form-control" name="phone" placeholder="0547123456" value={towingForm.phone} onChange={handleTowingInputChange} />
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="form-label">Experience</label>
                          <input type="text" className="form-control" name="experience" placeholder="e.g., 12 years" value={towingForm.experience} onChange={handleTowingInputChange} />
                        </div>
                      </div>

                      <div className="form-section">
                        <h3>Details</h3>
                        <div className="form-group">
                          <label className="form-label">Description</label>
                          <textarea className="form-control" name="description" placeholder="Describe the towing service..." value={towingForm.description} onChange={handleTowingInputChange} style={{ minHeight: 100 }} />
                        </div>
                        <div className="grid grid-2">
                          <div className="form-group">
                            <label className="form-label">Rating</label>
                            <input type="number" className="form-control" name="rating" placeholder="4.7" step="0.1" min="0" max="5" value={towingForm.rating} onChange={handleTowingInputChange} />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Review Count</label>
                            <input type="number" className="form-control" name="reviews" placeholder="0" value={towingForm.reviews} onChange={handleTowingInputChange} />
                          </div>
                        </div>
                      </div>

                      {!capturedImageTowing && (
                        <div className="info-box warning">
                          <AlertCircle size={18} />
                          <span>Please capture or upload a photo before submitting.</span>
                        </div>
                      )}

                      {capturedImageTowing && (
                        <div className="info-box success">
                          <Check size={18} />
                          <span>Photo captured successfully.</span>
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: 12 }}>
                        <button type="button" className="btn btn-secondary" onClick={() => setStep('camera')} style={{ flex: 1 }}>
                          <Camera size={16} /> Change Photo
                        </button>
                        <button type="submit" className="btn btn-primary btn-lg" style={{ flex: 1 }} disabled={!capturedImageTowing}>
                          <Plus size={16} /> Add Towing Vehicle
                        </button>
                      </div>
                    </form>
                  )}

                  {step === 'fleet' && (
                    <div className="fleet-section">
                      <h3 style={{ marginBottom: 20 }}>Towing Fleet ({towingVehicles.length} vehicles)</h3>
                      {towingVehicles.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--gray-1)' }}>
                          <p>No towing vehicles in fleet yet. Start by adding a new vehicle.</p>
                        </div>
                      ) : (
                        <div className="fleet-grid">
                          {towingVehicles.map(vehicle => (
                            <div key={vehicle.id} className="fleet-card">
                              <div className="fleet-image">
                                <img src={vehicle.image} alt={vehicle.name} />
                                <div className="fleet-overlay">
                                  <button className="btn btn-danger" onClick={() => setDeleteConfirmTowing(vehicle.id)} title="Delete this vehicle">
                                    <Trash2 size={16} /> Delete
                                  </button>
                                </div>
                              </div>
                              <div className="fleet-info">
                                <div className="fleet-name">{vehicle.brand} {vehicle.name}</div>
                                <div className="fleet-meta">
                                  <span>{vehicle.tag}</span>
                                  <span>•</span>
                                  <span>{vehicle.towCapacity}</span>
                                </div>
                                <div className="fleet-price">GHS {vehicle.priceGHS}/hr</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {deleteConfirmTowing && (
                    <div style={{
                      position: 'fixed',
                      inset: 0,
                      background: 'rgba(0,0,0,0.7)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 1000,
                    }}>
                      <div style={{
                        background: 'var(--dark-2)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-lg)',
                        padding: 24,
                        maxWidth: 400,
                        textAlign: 'center',
                      }}>
                        <AlertCircle size={48} style={{ color: 'var(--primary)', marginBottom: 16, margin: 'auto' }} />
                        <h3 style={{ marginBottom: 8 }}>Delete Towing Vehicle?</h3>
                        <p style={{ color: 'var(--gray-1)', marginBottom: 24 }}>
                          Are you sure you want to remove this vehicle from the towing fleet?
                        </p>
                        <div style={{ display: 'flex', gap: 12 }}>
                          <button className="btn btn-secondary btn-lg" onClick={() => setDeleteConfirmTowing(null)} style={{ flex: 1 }}>
                            Cancel
                          </button>
                          <button className="btn btn-danger btn-lg" onClick={() => { deleteTowingVehicle(deleteConfirmTowing); setDeleteConfirmTowing(null); }} style={{ flex: 1 }}>
                            <Trash2 size={16} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Stats Sidebar */}
          <div className="admin-sidebar">
            {adminTab === 'overview' && (
              <div className="admin-card">
                <h3>Business Snapshot</h3>
                <div className="stat-box">
                  <div className="stat-number">{cars.length}</div>
                  <div className="stat-label">Vehicles In Fleet</div>
                </div>
                <div className="stat-box" style={{ background: 'rgba(255,152,0,0.1)', borderColor: 'rgba(255,152,0,0.2)' }}>
                  <div className="stat-number" style={{ color: '#ffa500' }}>{towingVehicles.length}</div>
                  <div className="stat-label">Towing Vehicles</div>
                </div>
                <div className="stat-box" style={{ background: 'rgba(46,160,67,0.1)', borderColor: 'rgba(46,160,67,0.2)' }}>
                  <div className="stat-number" style={{ color: 'var(--success)' }}>{spareParts.length}</div>
                  <div className="stat-label">Spare Parts</div>
                </div>
              </div>
            )}

            {adminTab === 'bookings' && (
              <div className="admin-card">
                <h3>Booking Actions</h3>
                <p style={{ fontSize: 13, color: 'var(--gray-1)', lineHeight: 1.6 }}>
                  Pending bookings can be approved or rejected from the list. Approving confirms the rental; rejecting frees the vehicle for other customers.
                </p>
              </div>
            )}

            {adminTab === 'cars' && (
              <>
                <div className="admin-card">
                  <h3>Fleet Summary</h3>
                  <div className="stat-box">
                    <div className="stat-number">{cars.length}</div>
                    <div className="stat-label">Total Vehicles</div>
                  </div>
                </div>

                <div className="admin-card">
                  <h3>Categories</h3>
                  <div className="category-list">
                    {['Luxury', 'Electric', 'Sports', 'SUV', 'Economy', 'Van'].map(cat => {
                      const count = cars.filter(c => c.category === cat).length;
                      return (
                        <div key={cat} className="cat-row">
                          <span>{cat}</span>
                          <span className="cat-badge">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {adminTab === 'parts' && (
              <>
                <div className="admin-card">
                  <h3>Catalog Summary</h3>
                  <div className="stat-box">
                    <div className="stat-number">{spareParts.length}</div>
                    <div className="stat-label">Total Parts</div>
                  </div>
                </div>

                <div className="admin-card">
                  <h3>Categories</h3>
                  <div className="category-list">
                    {['Engine', 'Brakes', 'Suspension', 'Electrical', 'Cooling'].map(cat => {
                      const count = spareParts.filter(p => p.category === cat).length;
                      return (
                        <div key={cat} className="cat-row">
                          <span>{cat}</span>
                          <span className="cat-badge">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {adminTab === 'towing' && (
              <div className="admin-card">
                <h3>Towing Fleet</h3>
                <div className="stat-box">
                  <div className="stat-number">{towingVehicles.length}</div>
                  <div className="stat-label">Total Vehicles</div>
                </div>
                <div style={{ marginTop: 20, padding: 12, background: 'rgba(230,57,70,0.1)', borderRadius: 'var(--radius)', fontSize: 12, color: 'var(--gray-1)' }}>
                  <strong>Status:</strong> All vehicles available
                </div>
              </div>
            )}

            <div className="admin-card">
              <h3>Quick Tips</h3>
              <ul className="tips-list">
                {adminTab === 'overview' && (
                  <>
                    <li>Overview shows live business stats</li>
                    <li>Revenue reflects completed payments</li>
                    <li>Approve pending bookings promptly</li>
                  </>
                )}
                {adminTab === 'bookings' && (
                  <>
                    <li>Approve bookings to confirm rentals</li>
                    <li>Reject bookings that conflict with the fleet</li>
                    <li>Only admin users can approve or reject</li>
                  </>
                )}
                {adminTab === 'cars' && (
                  <>
                    <li>Use clear, well-lit photos of vehicles</li>
                    <li>Include multiple angles (camera saves 6 copies)</li>
                    <li>Fill all required fields marked with *</li>
                    <li>Features are separated by commas</li>
                  </>
                )}
                {adminTab === 'parts' && (
                  <>
                    <li>Capture clear product photos</li>
                    <li>Include brand and model information</li>
                    <li>Prices displayed in GHS</li>
                    <li>Update stock quantities regularly</li>
                  </>
                )}
                {adminTab === 'towing' && (
                  <>
                    <li>Use vehicle front/side photos</li>
                    <li>Include operator contact info</li>
                    <li>Verify phone numbers</li>
                    <li>Set accurate hourly rates in GHS</li>
                  </>
                )}
                <li>Items are instantly available after adding</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <style>{`
        .admin-layout {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 32px;
          align-items: start;
        }

        .admin-card {
          background: var(--dark-2);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 24px;
          margin-bottom: 20px;
        }

        .admin-card h2,
        .admin-card h3 {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 20px;
        }

        .admin-tabs-main {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
          border-bottom: 1px solid var(--border);
          padding-bottom: 0;
        }

        .admin-tab-main {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 14px 18px;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          color: var(--gray-1);
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .admin-tab-main.active {
          color: var(--primary);
          border-bottom-color: var(--primary);
        }

        .admin-tab-main:hover {
          color: var(--white);
        }

        .admin-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          border-bottom: 1px solid var(--border);
        }

        .admin-tab {
          padding: 12px 16px;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          color: var(--gray-1);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .admin-tab.active {
          color: var(--primary);
          border-bottom-color: var(--primary);
        }

        .admin-tab:hover {
          color: var(--white);
        }

        .form-section {
          margin-bottom: 28px;
          padding-bottom: 28px;
          border-bottom: 1px solid var(--border);
        }

        .form-section:last-child {
          border-bottom: none;
        }

        .form-section h3 {
          font-size: 14px;
          font-weight: 700;
          color: var(--gray-1);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 16px;
        }

        .camera-section {
          margin-bottom: 20px;
        }

        .camera-container {
          background: var(--dark-3);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 24px;
          margin-bottom: 16px;
        }

        .camera-placeholder {
          text-align: center;
          padding: 60px 24px;
          color: var(--gray-1);
        }

        .camera-placeholder svg {
          margin-bottom: 16px;
          opacity: 0.5;
        }

        .camera-placeholder div {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .camera-live {
          position: relative;
        }

        .camera-controls {
          display: flex;
          gap: 12px;
          margin-top: 16px;
          justify-content: center;
        }

        .captured-image img {
          max-height: 400px;
          width: 100%;
          object-fit: cover;
        }

        .image-actions {
          display: flex;
          gap: 12px;
          margin-top: 16px;
          justify-content: center;
        }

        .grid {
          display: grid;
          gap: 16px;
          margin-bottom: 16px;
        }

        .grid-2 {
          grid-template-columns: repeat(2, 1fr);
        }

        .grid-3 {
          grid-template-columns: repeat(3, 1fr);
        }

        .grid-1 {
          grid-template-columns: 1fr;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-label {
          font-size: 12px;
          font-weight: 700;
          color: var(--gray-1);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-control {
          background: var(--dark-3);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 10px 14px;
          color: #fff;
          font-size: 14px;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s;
        }

        .form-control:focus {
          border-color: var(--primary);
        }

        .form-control::placeholder {
          color: var(--gray-2);
        }

        .info-box {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          border-radius: var(--radius);
          border: 1px solid var(--border);
          margin-bottom: 20px;
          font-size: 14px;
        }

        .info-box.warning {
          background: rgba(255, 152, 0, 0.1);
          border-color: rgba(255, 152, 0, 0.3);
          color: #ffa500;
        }

        .info-box.success {
          background: rgba(46, 160, 67, 0.1);
          border-color: rgba(46, 160, 67, 0.3);
          color: var(--success);
        }

        .admin-form-fields {
          display: flex;
          flex-direction: column;
        }

        /* Sidebar */
        .admin-sidebar {
          display: flex;
          flex-direction: column;
        }

        .stat-box {
          text-align: center;
          padding: 20px;
          background: rgba(230, 57, 70, 0.1);
          border: 1px solid rgba(230, 57, 70, 0.2);
          border-radius: var(--radius);
          margin-bottom: 16px;
        }

        .stat-number {
          font-size: 32px;
          font-weight: 800;
          color: var(--primary);
        }

        .stat-label {
          font-size: 12px;
          color: var(--gray-1);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: 8px;
        }

        .category-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .cat-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 6px;
          font-size: 13px;
        }

        .cat-badge {
          background: var(--primary);
          color: #fff;
          padding: 2px 8px;
          border-radius: 100px;
          font-weight: 700;
          font-size: 12px;
        }

        .tips-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .tips-list li {
          font-size: 13px;
          color: var(--gray-1);
          padding-left: 20px;
          position: relative;
        }

        .tips-list li:before {
          content: "✓";
          position: absolute;
          left: 0;
          color: var(--success);
          font-weight: 700;
        }

        @media (max-width: 1024px) {
          .admin-layout {
            grid-template-columns: 1fr;
          }

          .grid-3 {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .admin-card {
            padding: 16px;
          }

          .grid-2,
          .grid-3 {
            grid-template-columns: 1fr;
          }

          .camera-placeholder {
            padding: 40px 16px;
          }

          .camera-controls,
          .image-actions {
            flex-direction: column;
          }

          .camera-controls button,
          .image-actions button {
            width: 100%;
          }
        }

        .fleet-section {
          padding-top: 0;
        }

        .fleet-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
        }

        .fleet-card {
          background: var(--dark-3);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition: all 0.3s;
        }

        .fleet-card:hover {
          border-color: var(--primary);
          transform: translateY(-4px);
        }

        .fleet-image {
          position: relative;
          width: 100%;
          height: 150px;
          overflow: hidden;
          background: var(--dark-2);
        }

        .fleet-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .fleet-video-wrap {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .fleet-video-wrap video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .video-badge {
          position: absolute;
          top: 8px;
          left: 8px;
          background: rgba(230, 57, 70, 0.9);
          color: #fff;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .fleet-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .fleet-card:hover .fleet-overlay {
          opacity: 1;
        }

        .fleet-info {
          padding: 16px;
        }

        .fleet-name {
          font-weight: 700;
          font-size: 15px;
          margin-bottom: 6px;
        }

        .fleet-meta {
          font-size: 12px;
          color: var(--gray-1);
          margin-bottom: 10px;
        }

        .fleet-price {
          color: var(--primary);
          font-weight: 700;
          font-size: 16px;
        }

        .btn-danger {
          background: rgba(230,57,70,0.2);
          border: 1px solid rgba(230,57,70,0.5);
          color: var(--primary);
        }

        .btn-danger:hover {
          background: rgba(230,57,70,0.3);
          border-color: var(--primary);
        }

        @media (max-width: 640px) {
          .fleet-grid {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          }
        }

        .media-type-selector {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
          border-bottom: 1px solid var(--border);
          padding-bottom: 16px;
        }

        .media-type-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          color: var(--gray-1);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }

        .media-type-btn.active {
          color: var(--primary);
          border-bottom-color: var(--primary);
        }

        .media-type-btn:hover {
          color: var(--white);
        }

        .recording-indicator {
          position: absolute;
          top: 16px;
          left: 16px;
          background: rgba(0,0,0,0.6);
          color: var(--white);
          padding: 8px 16px;
          border-radius: 100px;
          font-size: 14px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .recording-indicator.active {
          background: rgba(230,57,70,0.8);
          color: #fff;
        }

        .rec-dot {
          width: 8px;
          height: 8px;
          background: #fff;
          border-radius: 50%;
          animation: pulse 1s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .btn-warning {
          background: rgba(255, 152, 0, 0.2);
          border: 1px solid rgba(255, 152, 0, 0.5);
          color: #ffa500;
        }

        .btn-warning:hover {
          background: rgba(255, 152, 0, 0.3);
          border-color: #ffa500;
        }
      `}</style>
    </main>
  );
}
