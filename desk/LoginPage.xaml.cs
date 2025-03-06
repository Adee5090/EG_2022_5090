using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Windows;
using System.Windows.Controls;
using AdminDashboard;

namespace desktop
{
    public partial class LoginPage : Page
    {
        public LoginPage()
        {
            InitializeComponent();
        }

        private async void LoginButton_Click(object sender, RoutedEventArgs e)
        {
            string email = EmailTextBox.Text;
            string password = PasswordBox.Password;

            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
            {
                ErrorMessage.Text = "Email and password are required.";
                ErrorMessage.Visibility = Visibility.Visible;
                return;
            }

            var loginData = new
            {
                email = email,
                password = password
            };

            try
            {
                using (HttpClient client = new HttpClient())
                {
                    var content = new StringContent(JsonSerializer.Serialize(loginData), Encoding.UTF8, "application/json");
                    HttpResponseMessage response = await client.PostAsync("http://localhost:5000/login", content);

                    if (response.IsSuccessStatusCode)
                    {
                        var responseData = await response.Content.ReadAsStringAsync();
                        var loginResponse = JsonSerializer.Deserialize<LoginResponse>(responseData);

                        if (loginResponse.token != null)
                        {
                            // Store token and user type in application properties
                            Application.Current.Properties["Token"] = loginResponse.token;
                            Application.Current.Properties["UserType"] = loginResponse.type;

                            // Navigate to the appropriate dashboard
                            if (loginResponse.type == "admin")
                            {
                                // Navigate to AdminDashboard
                                NavigationService.Navigate(new AdminDashboard());
                            }
                            else
                            {
                                // Navigate to User Dashboard (if needed)
                                NavigationService.Navigate(new MainWindow());
                            }
                        }
                    }
                    else
                    {
                        var errorResponse = await response.Content.ReadAsStringAsync();
                        var error = JsonSerializer.Deserialize<ErrorResponse>(errorResponse);
                        ErrorMessage.Text = error.message;
                        ErrorMessage.Visibility = Visibility.Visible;
                    }
                }
            }
            catch (Exception ex)
            {
                ErrorMessage.Text = "Something went wrong. Please try again.";
                ErrorMessage.Visibility = Visibility.Visible;
                Console.WriteLine(ex.Message);
            }
        }

        private class LoginResponse
        {
            public string message { get; set; }
            public string token { get; set; }
            public string type { get; set; }
        }

        private class ErrorResponse
        {
            public string message { get; set; }
        }
    }
}