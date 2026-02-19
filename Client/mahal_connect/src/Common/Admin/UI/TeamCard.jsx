// const TeamCard = ({ team }) => (
//   <Card className="border-0 shadow-sm rounded-4 h-100 p-3">
//     <Card.Body>
//       <div className="d-flex justify-content-between align-items-start mb-2">
//         <Card.Title className="fw-bold fs-5 mb-0">{team.title}</Card.Title>
//         <Badge bg={team.status === 'active' ? 'success' : 'warning'} className="text-capitalize opacity-75">
//           {team.status}
//         </Badge>
//       </div>
//       <Card.Subtitle className="text-muted mb-3">{team.category}</Card.Subtitle>
//       <Card.Text className="text-secondary small mb-4">
//         {team.description}
//       </Card.Text>
      
//       <div className="d-flex align-items-center text-muted small mb-3">
//         <Calendar size={14} className="me-2" /> {team.date}
//       </div>
      
//       <div className="d-flex align-items-center mb-4">
//         <div className="avatar-group d-flex">
//           {/* Mock Avatars */}
//           <div className="rounded-circle bg-secondary text-white small d-flex align-items-center justify-content-center me-n2 border border-white" style={{width: '32px', height: '32px'}}>AH</div>
//           <div className="rounded-circle bg-info text-white small d-flex align-items-center justify-content-center border border-white" style={{width: '32px', height: '32px'}}>FK</div>
//         </div>
//         <span className="ms-3 small text-muted">{team.members} Members</span>
//       </div>

//       <div className="d-flex gap-2">
//         <Button variant="outline-dark" className="flex-grow-1 rounded-pill">
//           <Edit2 size={14} className="me-2" /> Edit
//         </Button>
//         <Button variant="outline-danger" className="rounded-circle p-2">
//           <Trash2 size={14} />
//         </Button>
//       </div>
//     </Card.Body>
//   </Card>
// );

// export default TeamCard