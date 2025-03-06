using System;
using System.Collections.ObjectModel;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Windows;
using System.Windows.Controls;
using Microsoft.Win32;

namespace desktop
{
    public partial class PdfPage : Page
    {
        // Observable collection to store the list of uploaded PDFs
        public ObservableCollection<PdfItem> Pdfs { get; set; }

        public PdfPage()
        {
            InitializeComponent();
            Pdfs = new ObservableCollection<PdfItem>();
            UploadedPdfList.ItemsSource = Pdfs; // Bind the ListView to the ObservableCollection
            FetchPdfs(); // Fetch PDFs when the page loads
        }

        // Fetch PDFs from the API
        private async void FetchPdfs()
        {
            try
            {
                using (HttpClient client = new HttpClient())
                {
                    HttpResponseMessage response = await client.GetAsync("http://localhost:5000/pdfs");

                    if (response.IsSuccessStatusCode)
                    {
                        var responseData = await response.Content.ReadAsStringAsync();
                        var pdfs = JsonSerializer.Deserialize<List<PdfItem>>(responseData);

                        // Clear the existing list and add the fetched PDFs
                        Pdfs.Clear();
                        foreach (var pdf in pdfs)
                        {
                            Pdfs.Add(pdf);
                        }
                    }
                    else
                    {
                        MessageBox.Show("Failed to fetch PDFs.");
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Something went wrong: {ex.Message}");
                Console.WriteLine($"Error: {ex}");
            }
        }

        // Event handler for the "Upload PDF" button
        private async void UploadPdfButton_Click(object sender, RoutedEventArgs e)
        {
            string title = PdfTitleTextBox.Text.Trim();
            string filePath = ChooseFileButton.Content.ToString();

            if (string.IsNullOrEmpty(title) || filePath == "Choose File")
            {
                MessageBox.Show("Please enter a title and select a file.");
                return;
            }

            try
            {
                using (HttpClient client = new HttpClient())
                {
                    // Add JWT token to the request headers
                    string token = Application.Current.Properties["Token"] as string;
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

                    // Prepare the form data
                    var formData = new MultipartFormDataContent();
                    formData.Add(new StringContent(title), "title");

                    // Add the file content
                    var fileContent = new ByteArrayContent(File.ReadAllBytes(filePath));
                    fileContent.Headers.ContentType = MediaTypeHeaderValue.Parse("application/pdf");
                    formData.Add(fileContent, "pdf", Path.GetFileName(filePath));

                    // Send the request
                    HttpResponseMessage response = await client.PostAsync("http://localhost:5000/admin/upload-pdf", formData);

                    if (response.IsSuccessStatusCode)
                    {
                        MessageBox.Show("PDF uploaded successfully!");
                        FetchPdfs(); // Refresh the PDF list
                    }
                    else
                    {
                        var errorResponse = await response.Content.ReadAsStringAsync();
                        MessageBox.Show($"Failed to upload PDF: {errorResponse}");
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Something went wrong: {ex.Message}");
                Console.WriteLine($"Error: {ex}");
            }
        }

        // Event handler for the "Choose File" button
        private void ChooseFileButton_Click(object sender, RoutedEventArgs e)
        {
            var fileDialog = new OpenFileDialog();
            fileDialog.Filter = "PDF Files (*.pdf)|*.pdf";

            if (fileDialog.ShowDialog() == true)
            {
                ChooseFileButton.Content = fileDialog.FileName;
            }
        }

        // Event handler for deleting a PDF
        private async void DeletePdfButton_Click(object sender, RoutedEventArgs e)
        {
            var button = sender as Button;
            var pdfItem = button?.DataContext as PdfItem;

            if (pdfItem != null)
            {
                try
                {
                    using (HttpClient client = new HttpClient())
                    {
                        // Add JWT token to the request headers
                        string token = Application.Current.Properties["Token"] as string;
                        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

                        // Send the delete request
                        HttpResponseMessage response = await client.DeleteAsync($"http://localhost:5000/admin/delete-pdf/{pdfItem.pdf_id}");

                        if (response.IsSuccessStatusCode)
                        {
                            MessageBox.Show("PDF deleted successfully!");
                            FetchPdfs(); // Refresh the PDF list
                        }
                        else
                        {
                            var errorResponse = await response.Content.ReadAsStringAsync();
                            MessageBox.Show($"Failed to delete PDF: {errorResponse}");
                        }
                    }
                }
                catch (Exception ex)
                {
                    MessageBox.Show($"Something went wrong: {ex.Message}");
                    Console.WriteLine($"Error: {ex}");
                }
            }
        }
    }

    // Class representing each PDF item
    public class PdfItem
    {
        public int pdf_id { get; set; }
        public string title { get; set; }
        public string url { get; set; }
    }
}