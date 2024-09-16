import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Home() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state if needed

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_URL}/getstudents`)
            .then((res) => {
                setData(res.data);  // Set the data received from the API
                setLoading(false);  // Set loading to false when data is received
            })
            .catch((err) => {
                console.log(err);
                setError('Failed to fetch data');
                setLoading(false);  // Set loading to false on error
            });
    }, []);  // Fetch data only once when the component mounts

    // Delete function
    const deleteItem = (id) => {
        const confirmed = window.confirm('Are you sure you want to delete?');
        if (confirmed) {
            axios.delete(`${process.env.REACT_APP_URL}/delete/${id}`)
                .then((res) => {
                    console.log(res);  // Log successful delete message
                    setData(data.filter((item) => item._id !== id));  // Remove the deleted item from state
                })
                .catch((err) => console.log(err));
        } else {
            console.log('Deletion cancelled by the user.');
        }
    };

    // Conditionally render based on the loading and data states
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (data.length === 0) {
        return <div>No Data Available</div>;
    }

    return (
        <div>
            <div className='d-flex h-100 bg-primary justify-content-center align-items-center'>
                <div className='mw-50 bg-white rounded p-3 mt-3 mb-3'>
                    <h2>Student List :</h2>
                    <div className='d-flex justify-content-end'>
                        <Link to='/create' className='btn btn-sm btn-success'>Create +</Link>
                    </div>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>User Name</th>
                                <th>Email</th>
                                <th>Phone no</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.map((st, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{st.name}</td>
                                    <td>{st.email}</td>
                                    <td>{st.phone}</td>
                                    <td className='d-flex gap-1 justify-content-spacebetween'>
                                        <Link to={`/Read/${st._id}`} className='btn btn-sm btn-success'>Read</Link>
                                        <Link to={`/edit/${st._id}`} className="btn btn-primary">Edit</Link>
                                        <button className='btn btn-sm btn-danger' onClick={() => deleteItem(st._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
