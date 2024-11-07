import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import AppContext from './AppContext';

const ProfileCompletion = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    profilePicture: null,
    skills: [],
  });
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const { updateProfile, userId } = AppContext();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, profilePicture: 'حجم الصورة يجب أن يكون أقل من 5 ميجابايت' });
        return;
      }
      

      setProfilePicture(file);
      setErrors({ ...errors, profilePicture: '' });
      
      const previewUrl = URL.createObjectURL(file);
      setProfilePreview(previewUrl);
    }
  };

  const handleFormSubmission = async () => {
    try {
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => formDataToSend.append(key, formData[key]));
      
      formDataToSend.append('skills', JSON.stringify(selectedSkills.map(skill => skill._id)));
      
      if (profilePicture instanceof File) {
        formDataToSend.append('profilePicture', profilePicture);
      }

      const response = await updateProfile(userId, formDataToSend);
      
      if (response.message === 'User was edited successfully') {
        Swal.fire({
          icon: 'success',
          title: 'تم حفظ الملف الشخصي بنجاح',
          showConfirmButton: false,
          text: `شكراً ${formData.firstName}`,
          timer: 1500
        }).then(() => {
          window.location.href = '/';
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'حدث خطأ أثناء حفظ البيانات'
      });
    }
  };

  return (
    <div>
      {/* Render your form components here */}
    </div>
  );
};

export default ProfileCompletion; 