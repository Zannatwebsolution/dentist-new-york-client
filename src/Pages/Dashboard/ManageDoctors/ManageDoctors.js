import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import toast from "react-hot-toast";
import ConfirmationModal from "../../SharedPage/ConfirmationModal/ConfirmationModal";

const ManageDoctors = () => {
  const [deletingDoctor, setDeletingDoctor] = useState(null);
  const closeModal = ()=>{
    setDeletingDoctor(null)
  }

  // All Doctor
  const { data: doctors = [], refetch } = useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      try {
        const res = await fetch("https://doctors-portal-client-server-developertanbir-gmailcom.vercel.app/doctors", {
          headers: {
            authorization: localStorage.getItem("token")
          }
        });
        const data = res.json();
        return data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  // Delete Doctor
  const handleDeleteDoctor = (doctor)=>{
    console.log(doctor)
    fetch(`https://doctors-portal-client-server-developertanbir-gmailcom.vercel.app/doctors/${doctor._id}`, {
      method: "DELETE", 
        headers: {
          authorization: localStorage.getItem("token")
        }
    })
    .then(res=>res.json())
    .then(data=>{
      if(data.deletedCount > 0){
        
      toast.success(`Successfully Delete Doctor ${doctor.name}`)
      refetch();
      console.log(data)
      }
    })
  }
  return (
    <div>
      <h2 className="text-3xl mb-5">Manage Doctors {doctors.length}</h2>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th></th>
              <th>Avatar</th>
              <th>Name</th>
              <th>Email</th>
              <th>Specialty</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor, i) => (
              <tr key={doctor._id}>
                <th>{i + 1}</th>
                <th>
                  <div className="avatar">
                    <div className="w-24 rounded-full">
                      <img src={doctor.image} alt="Doctor Profile" />
                    </div>
                  </div>
                </th>
                <td>{doctor.name}</td>
                <td>{doctor.email}</td>
                <td>{doctor.specialty}</td>
                <td>
                  <label
                    onClick={() => setDeletingDoctor(doctor)}
                    htmlFor="confirmation-modal"
                    className="btn btn-sm btn-error"
                  >
                    Delete
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {deletingDoctor && <ConfirmationModal
        title={`Are you sure you want to delete?`}
        message={`If you delete ${deletingDoctor.name}. It cannot be undone`}
        modalData={deletingDoctor}
        successAction={handleDeleteDoctor}
        closeModal={closeModal}
        successButtonName="Delete"
      ></ConfirmationModal>}
    </div>
  );
};

export default ManageDoctors;
