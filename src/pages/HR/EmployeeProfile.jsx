import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Pagination,
} from "@mui/material";
import axios from "axios";
import { baseUrl } from "../../utils/service";

const EmployeeSummary = () => {
  const [employees, setEmployees] = useState([]); // curretn page employees
  const [totalEmployees, setTotalEmployees] = useState(0); // all employees
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchEmployees = async (page = 1, searchQuery = "") => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/profileRoutes/all-user/?page=${page}&limit=10&search=${searchQuery}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      const { users, totalUsers, totalPages } = response.data;
      console.log(users);
      // Sort users alphabetically by last name
      const sortedUsers = users.sort((a, b) =>
        a.profile.name.lastName.localeCompare(b.profile.name.lastName)
      );

      setEmployees(sortedUsers);
      setTotalEmployees(totalUsers);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees(page, searchQuery);
  }, [page, searchQuery]);

  // handle seach bar
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to the first page on a new search
  };

  const handlePaginationChange = (event, value) => {
    setPage(value);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Employee Summary
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Total Employees: {totalEmployees}
      </Typography>

      {/* Search Bar */}
      <TextField
        label="Search by Name"
        variant="outlined"
        fullWidth
        sx={{ mb: 3 }}
        value={searchQuery}
        onChange={handleSearchChange}
      />

      {/* Employee Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>SSN</TableCell>
              <TableCell>Work Authorization Title</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee._id}>
                {/* Name as Link */}
                <TableCell>
                  <a
                    href={`/profile/${employee._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {`${employee.profile.name.firstName} ${employee.profile.name.lastName}`}
                  </a>
                </TableCell>
                <TableCell>{employee.profile.ssn}</TableCell>
                <TableCell>
                  {employee.profile.residency.workAuthorization?.visaType}
                </TableCell>
                <TableCell>{employee.profile.contactInfo.cellPhone}</TableCell>
                <TableCell>{employee.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Controls */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePaginationChange}
          color="primary"
        />
      </Box>

      {/* Loading Indicator */}
      {loading && (
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Loading employees...
        </Typography>
      )}
    </Box>
  );
};

export default EmployeeSummary;
