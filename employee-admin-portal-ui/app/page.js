'use client';

import { useEffect, useState } from 'react';
import {
  Container, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, IconButton,
  Dialog, DialogActions, DialogContent, DialogTitle, TextField,
  Box, Stack, AppBar, Toolbar, Card, CardContent, Snackbar,
  Alert, Tooltip, CircularProgress, Fade
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import RefreshIcon from '@mui/icons-material/Refresh';
import { getEmployees, addEmployee, updateEmployee, deleteEmployee } from '../services/api';

export default function Home() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dialog States
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // Form & Editting State
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    salary: ''
  });

  // Notification State
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await getEmployees();
      setEmployees(response.data);
    } catch (error) {
      showSnackbar("Error fetching employees", "error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setIsEdit(false);
    setFormData({ name: '', email: '', department: '', salary: '' });
  };

  const handleEdit = (employee) => {
    setOpenDialog(true);
    setIsEdit(true);
    setCurrentId(employee.employeeId);
    setFormData({
      name: employee.name,
      email: employee.email,
      department: employee.department || '',
      salary: employee.salary
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (isEdit) {
        await updateEmployee(currentId, formData);
        showSnackbar("Employee updated successfully", "success");
      } else {
        await addEmployee(formData);
        showSnackbar("Employee added successfully", "success");
      }
      handleCloseDialog();
      fetchEmployees();
    } catch (error) {
      console.error("Error saving employee:", error);
      showSnackbar("Failed to save employee", "error");
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteEmployee(deleteId);
      showSnackbar("Employee deleted successfully", "success");
      fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
      showSnackbar("Failed to delete employee", "error");
    } finally {
      setDeleteConfirmOpen(false);
      setDeleteId(null);
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Header */}
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid #e0e0e0' }}>
        <Toolbar>
          <PersonIcon sx={{ color: 'primary.main', mr: 2, fontSize: 30 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'text.primary', fontWeight: 600 }}>
            Employee<Box component="span" sx={{ color: 'primary.main' }}>Portal</Box>
          </Typography>
          <Button
            startIcon={<RefreshIcon />}
            onClick={fetchEmployees}
            sx={{ mr: 2 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
            disableElevation
            sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}
          >
            Add Employee
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
        <Fade in={!loading}>
          <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
            <CardContent sx={{ p: 0 }}>
              <TableContainer>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>NAME</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>EMAIL</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>DEPARTMENT</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>SALARY</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, color: 'text.secondary' }}>ACTIONS</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {employees.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                          <Typography variant="body1" color="text.secondary">
                            No employees found.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      employees.map((employee) => (
                        <TableRow
                          key={employee.employeeId}
                          sx={{
                            '&:hover': { bgcolor: '#f5f5f5' },
                            transition: 'background-color 0.2s'
                          }}
                        >
                          <TableCell sx={{ fontWeight: 500 }}>{employee.name}</TableCell>
                          <TableCell>{employee.email}</TableCell>
                          <TableCell>
                            <Box
                              component="span"
                              sx={{
                                bgcolor: '#e3f2fd',
                                color: '#1565c0',
                                py: 0.5,
                                px: 1.5,
                                borderRadius: 4,
                                fontSize: '0.875rem',
                                fontWeight: 500
                              }}
                            >
                              {employee.department || 'N/A'}
                            </Box>
                          </TableCell>
                          <TableCell>${employee.salary?.toLocaleString()}</TableCell>
                          <TableCell align="right">
                            <Tooltip title="Edit">
                              <IconButton
                                color="primary"
                                size="small"
                                onClick={() => handleEdit(employee)}
                                sx={{ mr: 1, bgcolor: 'rgba(25, 118, 210, 0.04)' }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                color="error"
                                size="small"
                                onClick={() => confirmDelete(employee.employeeId)}
                                sx={{ bgcolor: 'rgba(211, 47, 47, 0.04)' }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Fade>
      </Container>

      {/* Add/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid #eee', pb: 2 }}>
          <Typography variant="h6" component="div" fontWeight="600">
            {isEdit ? "Edit Employee" : "Add New Employee"}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
            />
            <TextField
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
            />
            <TextField
              label="Department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Salary"
              name="salary"
              type="number"
              value={formData.salary}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              InputProps={{
                startAdornment: <Box component="span" sx={{ color: 'text.secondary', mr: 1 }}>$</Box>,
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={handleCloseDialog} size="large" sx={{ color: 'text.secondary' }}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            size="large"
            disableElevation
            sx={{ px: 4 }}
          >
            {isEdit ? "Update Employee" : "Add Employee"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this employee? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained" disableElevation>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
