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
                <NavbarToggler onClick={toggle} />
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="me-auto" navbar>
                        <NavItem>
                            <Link to="/" className="nav-link">One</Link>
                        </NavItem>
                        <NavItem>
                            <Link to="/two" className="nav-link">Two</Link>
                        </NavItem>
                        <NavItem>
                            <Link to="/three" className="nav-link">Three</Link>
                        </NavItem>
                        <NavItem>
                            <Link to="/four" className="nav-link">Four</Link>
                        </NavItem>
                        <NavItem>
                            <Link to="/five" className="nav-link">Five</Link>
                        </NavItem>
                        <NavItem>
                            <Link to="/six" className="nav-link">Six</Link>
                        </NavItem>
                        <NavItem>
                            <Link to="/seven" className="nav-link">Seven</Link>
                        </NavItem>
                    </Nav>
                </Collapse>
            </Navbar>
        </div>
    );
}

export default NavBar;