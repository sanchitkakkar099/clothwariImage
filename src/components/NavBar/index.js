import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    Nav,
    NavItem,
} from 'reactstrap';

function NavBar(args) {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    return (
        <div>
            <Navbar {...args} expand="md" className="my-2 "
                color="light">
                <Link to="/" className="navbar-brand">1*1   </Link>
                <NavbarToggler onClick={toggle} />
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="me-auto" navbar>
                        {/* <NavItem>
                            <Link to="/2by2" className="nav-link">2*1</Link>
                        </NavItem> */}
                        <NavItem>
                            <Link to="/three" className="nav-link">3*1</Link>
                        </NavItem>
                        <NavItem>
                        <Link to="/five" className="nav-link">5*1</Link>
                        </NavItem>
                        <NavItem>
                        <Link to="/seven" className="nav-link">7*1</Link>
                        </NavItem>
                    </Nav>
                </Collapse>
            </Navbar>
        </div>
    );
}

export default NavBar;