using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Windows;
using System.Windows.Controls;

namespace desktop
{
    public partial class AdminDashboard : Page
    {
        public AdminDashboard()
        {
            InitializeComponent();
            LoadUserData();
            LoadCounts();
        }

        private async void LoadUserData()
        {
            try
            {
                using (HttpClient client = new HttpClient())
                {
                    // Add JWT token to the request headers
                    string token = Application.Current.Properties["Token"] as string;
                    if (string.IsNullOrEmpty(token))
                    {
                        MessageBox.Show("You are not logged in. Please log in first.");
                        NavigationService.Navigate(new LoginPage());
                        return;
                    }

                    client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

                    // Fetch all users
                    HttpResponseMessage response = await client.GetAsync("http://localhost:5000/admin/users");

                    // Log the response status code and content for debugging
                    Console.WriteLine($"Response Status Code: {response.StatusCode}");
                    string responseData = await response.Content.ReadAsStringAsync();
                    Console.WriteLine($"Response Content: {responseData}");

                    if (response.IsSuccessStatusCode)
                    {
                        var users = JsonSerializer.Deserialize<List<User>>(responseData);

                        // Bind users to the DataGrid
                        UserTable.ItemsSource = users;
                    }
                    else
                    {
                        // Display the error message from the API
                        var errorResponse = JsonSerializer.Deserialize<ErrorResponse>(responseData);
                        MessageBox.Show($"Failed to fetch users: {errorResponse.message}");
                    }
                }
            }
            catch (HttpRequestException httpEx)
            {
                // Handle HTTP request errors (e.g., network issues)
                MessageBox.Show($"Network error: {httpEx.Message}");
                Console.WriteLine($"HTTP Request Error: {httpEx}");
            }
            catch (JsonException jsonEx)
            {
                // Handle JSON parsing errors
                MessageBox.Show($"Error parsing API response: {jsonEx.Message}");
                Console.WriteLine($"JSON Parsing Error: {jsonEx}");
            }
            catch (Exception ex)
            {
                // Handle all other exceptions
                MessageBox.Show($"Something went wrong: {ex.Message}");
                Console.WriteLine($"Error: {ex}");
            }
        }

        private async void LoadCounts()
        {
            try
            {
                using (HttpClient client = new HttpClient())
                {
                    // Add JWT token to the request headers
                    string token = Application.Current.Properties["Token"] as string;
                    client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

                    // Fetch total users count
                    HttpResponseMessage userCountResponse = await client.GetAsync("http://localhost:5000/admin/user-count");
                    if (userCountResponse.IsSuccessStatusCode)
                    {
                        var userCountData = await userCountResponse.Content.ReadAsStringAsync();
                        var userCount = JsonSerializer.Deserialize<UserCountResponse>(userCountData);
                        TotalUsersTextBlock.Text = userCount.count.ToString();
                    }
                    else
                    {
                        var errorResponse = JsonSerializer.Deserialize<ErrorResponse>(await userCountResponse.Content.ReadAsStringAsync());
                        MessageBox.Show($"Failed to fetch user count: {errorResponse.message}");
                    }

                    // Fetch total PDFs count
                    HttpResponseMessage pdfCountResponse = await client.GetAsync("http://localhost:5000/admin/pdf-count");
                    if (pdfCountResponse.IsSuccessStatusCode)
                    {
                        var pdfCountData = await pdfCountResponse.Content.ReadAsStringAsync();
                        var pdfCount = JsonSerializer.Deserialize<PdfCountResponse>(pdfCountData);
                        TotalPdfsTextBlock.Text = pdfCount.count.ToString();
                    }
                    else
                    {
                        var errorResponse = JsonSerializer.Deserialize<ErrorResponse>(await pdfCountResponse.Content.ReadAsStringAsync());
                        MessageBox.Show($"Failed to fetch PDF count: {errorResponse.message}");
                    }
                }
            }
            catch (HttpRequestException httpEx)
            {
                MessageBox.Show($"Network error: {httpEx.Message}");
                Console.WriteLine($"HTTP Request Error: {httpEx}");
            }
            catch (JsonException jsonEx)
            {
                MessageBox.Show($"Error parsing API response: {jsonEx.Message}");
                Console.WriteLine($"JSON Parsing Error: {jsonEx}");
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Something went wrong: {ex.Message}");
                Console.WriteLine($"Error: {ex}");
            }
        }

        // User class to match the API response
        private class User
        {
            public int user_id { get; set; } // Change from string to int
            public string phone { get; set; }
            public string first_name { get; set; }
            public string last_name { get; set; }
            public string nic { get; set; }
            public string email { get; set; }
            public string adress { get; set; }
            public string type { get; set; }
        }

        // Response class for user count
        private class UserCountResponse
        {
            public int count { get; set; }
        }

        // Response class for PDF count
        private class PdfCountResponse
        {
            public int count { get; set; }
        }

        // Error response class
        private class ErrorResponse
        {
            public string message { get; set; }
        }

        // Handle PDF button click
        private void PdfButton_Click(object sender, RoutedEventArgs e)
        {
            // Navigate to the PDF page (if implemented)
            NavigationService.Navigate(new PdfPage());
        }
    }
}