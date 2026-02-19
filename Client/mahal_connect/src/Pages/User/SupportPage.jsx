import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Phone, Mail, HelpCircle, ChevronDown } from 'lucide-react';
import { Accordion, Card } from 'react-bootstrap';
import Floatingnav from '../../Common/User/FloatingNav';

const SupportPage = () => {
    const navigate = useNavigate();

    const faqs = [
        { q: "How long does certificate approval take?", a: "Typically, the Mahal Admin verifies documents within 2-3 working days. You will receive an email once approved." },
        { q: "What documents are required for marriage certificate?", a: "You need to upload the Nikah record signed by the Imam and identification proofs of both parties." },
        { q: "How can I pay my monthly contribution?", a: "You can use the 'Payments' section to upload your UPI screenshot or pay via Cash at the Mahal office." },
        { q: "Is dark mode available?", a: "Dark mode is currently under development and will be available in the next update!" }
    ];

    return (
        <div className="pb-5 mb-5">
            
            <div className="container mt-4 px-3">
                <div className="d-flex align-items-center gap-3 mb-4">
                    <button className="btn btn-light rounded-circle p-2 border shadow-sm" onClick={() => navigate(-1)}>
                        <ArrowLeft size={20} />
                    </button>
                    <h4 className="fw-bold mb-0">Help & Support</h4>
                </div>

                {/* Contact Cards */}
                <div className="row g-2 mb-4">
                    <div className="col-4">
                        <Card className="border-0 shadow-sm text-center py-3 rounded-4">
                            <Phone size={20} className="mx-auto mb-2 text-primary" />
                            <small className="fw-bold">Call</small>
                        </Card>
                    </div>
                    <div className="col-4">
                        <Card className="border-0 shadow-sm text-center py-3 rounded-4">
                            <MessageSquare size={20} className="mx-auto mb-2 text-success" />
                            <small className="fw-bold">Chat</small>
                        </Card>
                    </div>
                    <div className="col-4">
                        <Card className="border-0 shadow-sm text-center py-3 rounded-4">
                            <Mail size={20} className="mx-auto mb-2 text-danger" />
                            <small className="fw-bold">Email</small>
                        </Card>
                    </div>
                </div>

                <h6 className="fw-bold mb-3 px-1">Common Questions</h6>
                <Accordion className="custom-accordion border-0 shadow-sm rounded-4 overflow-hidden">
                    {faqs.map((faq, index) => (
                        <Accordion.Item eventKey={index.toString()} key={index} className="border-0 border-bottom">
                            <Accordion.Header className="py-2">
                                <span className="small fw-bold text-dark">{faq.q}</span>
                            </Accordion.Header>
                            <Accordion.Body className="small text-muted bg-light bg-opacity-50">
                                {faq.a}
                            </Accordion.Body>
                        </Accordion.Item>
                    ))}
                </Accordion>

                <Card className="mt-4 border-0 rounded-4 bg-primary text-white p-3 shadow-sm">
                    <div className="d-flex align-items-center gap-3">
                        <HelpCircle size={32} />
                        <div>
                            <h6 className="mb-0 fw-bold">Still need help?</h6>
                            <p className="smallest mb-0 opacity-75">Visit the Mahal Office directly between 9 AM - 5 PM.</p>
                        </div>
                    </div>
                </Card>
            </div>
            <Floatingnav />
        </div>
    );
};

export default SupportPage;