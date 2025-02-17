import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ role }) => {
    return (
        <div className="navbar bg-base-100 shadow-md">
            <div className="flex-1">
                <Link to="/" className="btn btn-ghost text-xl">MyApp</Link>
            </div>

            <div className="flex-none">
                <ul className="menu menu-horizontal p-0">
                    {role === 'admin' ? (
                        <>
                            <li><Link to="/view-users">View Users</Link></li>
                            <li><Link to="/view-products">View Products</Link></li>
                            <li><Link to="/add-products">Add Products</Link></li>
                            <li><Link to="/insights">Insights</Link></li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/shop">Shop</Link></li>
                            <li><Link to="/cart">My Cart</Link></li>
                            <li className="dropdown dropdown-end">
                                <label tabIndex={0} className="btn btn-ghost">Profile</label>
                                <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                                    <li><Link to="/profile/username">Change Username</Link></li>
                                    <li><Link to="/profile/password">Change Password</Link></li>
                                </ul>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Navbar;
