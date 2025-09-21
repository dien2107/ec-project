import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "~/redux/store";
import {
  fetchUsers,
  clearError,
  setSelectedUser,
  clearSelectedUser,
} from "~/redux/slices/exampleSlice";
import {
  testApiStatus,
  testDifferentStatusCodes,
} from "~/services/api-status-test";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export default function ReduxTest() {
  const dispatch = useAppDispatch();
  const { users, selectedUser, loading, error } = useAppSelector(
    (state) => state.example
  );

  const [apiTestResults, setApiTestResults] = useState<any[]>([]);

  useEffect(() => {
    // Tự động fetch users khi component mount
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleClearError = () => {
    dispatch(clearError());
  };

  const handleTestApiStatus = async () => {
    console.log("🧪 Testing API Status Access...");
    const result = await testApiStatus();
    console.log("Test Result:", result);
  };

  const handleTestStatusCodes = async () => {
    console.log("🧪 Testing Different Status Codes...");
    const results = await testDifferentStatusCodes();
    setApiTestResults(results);
    console.log("All Test Results:", results);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Redux Test Dashboard - Simple</h1>

      {/* Loading & Error */}
      {loading && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
          Loading...
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          Error: {error}
          <Button
            variant="outline"
            size="sm"
            className="ml-2"
            onClick={handleClearError}
          >
            Clear
          </Button>
        </div>
      )}

      {/* Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Redux Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button onClick={() => dispatch(fetchUsers())}>
              Fetch Users ({users.length})
            </Button>
            <Button
              variant="outline"
              onClick={() => dispatch(clearSelectedUser())}
            >
              Clear Selected User
            </Button>
            <Button variant="secondary" onClick={handleTestApiStatus}>
              Test API Status
            </Button>
            <Button variant="secondary" onClick={handleTestStatusCodes}>
              Test Status Codes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* API Status Test Results */}
      {apiTestResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>API Status Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {apiTestResults.map((result, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded border-l-4 ${
                    result.success
                      ? "border-green-500 bg-green-50"
                      : "border-red-500 bg-red-50"
                  }`}
                >
                  <div className="font-semibold">{result.test}</div>
                  <div className="text-sm">
                    Status:{" "}
                    <span className="font-mono">{result.status || "N/A"}</span>{" "}
                    - {result.statusText}
                  </div>
                  <div
                    className={`text-xs ${result.success ? "text-green-600" : "text-red-600"}`}
                  >
                    {result.success ? "✅ Success" : "❌ Failed"}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="border p-4 rounded hover:bg-gray-50 cursor-pointer"
                onClick={() => dispatch(setSelectedUser(user))}
              >
                <h3 className="font-semibold">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-500">{user.company.name}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected User */}
      {selectedUser && (
        <Card>
          <CardHeader>
            <CardTitle>Selected User Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <strong>Name:</strong> {selectedUser.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedUser.phone}
              </p>
              <p>
                <strong>Website:</strong> {selectedUser.website}
              </p>
              <p>
                <strong>Company:</strong> {selectedUser.company.name}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
