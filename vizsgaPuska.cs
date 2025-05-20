using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;


using System.IO;
using MySql.Data.MySqlClient;
using System.IO.Packaging;

namespace WpfApp1
{
    public class book
    {
        //create properties
        public int Bookcode { get; set; }
        public int Authorcode { get; set; }
        public string Category { get; set; }
        public string Title { get; set; }
        public int Price { get; set; }

        //create constructor method
        public book(int bookcode, int authorcode, string category, string title, int price)
        {
            Bookcode = bookcode;
            Authorcode = authorcode;
            Category = category;
            Title = title;
            Price = price;
        }

    }
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        List<book> books = new List<book>();
        string connStr = "server=localhost;user=root;database=bookstore;port=3306;password=;charset=utf8";
        public MainWindow()
        {
            InitializeComponent();
            WindowState=WindowState.Maximized;
            task3();
        }

        public void task3()
        {
            MySqlConnection conn = new MySqlConnection(connStr);
            try
            {
                conn.Open();
                string sql = "SELECT * FROM books";
                MySqlCommand query = new MySqlCommand(sql, conn);
                MySqlDataReader reader = query.ExecuteReader();

                while (reader.Read())
                {
                    books.Add(new book(Convert.ToInt32(reader[0]), Convert.ToInt32(reader[1]), Convert.ToString(reader[2]), Convert.ToString(reader[3]), Convert.ToInt32(reader[4])));
                }
                reader.Close();
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
            conn.Close();

            datagrid.ItemsSource = books;
        }

        private void button1_Click(object sender, RoutedEventArgs e)
        {
            MySqlConnection conn = new MySqlConnection(connStr);

            try
            {
                conn.Open();
                string sql = "CREATE TABLE stores_turnover SELECT CONCAT(stores.storename,' ',stores.city) AS store, SUM(turnover.quantity) AS piece, SUM(books.price*turnover.quantity) AS revenue FROM turnover INNER JOIN books ON turnover.bookcode=books.bookcode INNER JOIN stores ON turnover.storecode=stores.storecode GROUP BY store HAVING piece BETWEEN 1400 AND 2800 ORDER BY revenue";
                MySqlCommand query = new MySqlCommand( sql, conn);
                query.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "HIBA");
            }
        }

        private void button2_Click(object sender, RoutedEventArgs e)
        {
            MySqlConnection conn = new MySqlConnection(connStr);

            try
            {
                conn.Open();
                string sql = "CREATE TABLE piecenumber SELECT CONCAT(stores.storename,' ',stores.city) AS store, SUM(turnover.quantity) AS piece, SUM(books.price*turnover.quantity) AS revenue FROM turnover INNER JOIN books ON turnover.bookcode=books.bookcode INNER JOIN stores ON turnover.storecode=stores.storecode GROUP BY store HAVING piece<1400 OR piece>2800 ORDER BY revenue";
                MySqlCommand query = new MySqlCommand(sql, conn);
                query.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "HIBA");
            }
            conn.Close() ;
        }

        private void button3_Click(object sender, RoutedEventArgs e)
        {

        }

        private void button4_Click(object sender, RoutedEventArgs e)
        {
            MySqlConnection conn = new MySqlConnection(connStr);

            try
            {
                conn.Open();
                string sql = "DELETE FROM stores_turnover WHERE store LIKE 'Budapest'";
                MySqlCommand query = new MySqlCommand(sql, conn);
                query.ExecuteNonQuery();
            }
            catch(Exception ex)
            {
                MessageBox.Show(ex.Message, "HIBA");
            }
            conn.Close();
        }

        private void button5_Click(object sender, RoutedEventArgs e)
        {
            MySqlConnection conn =new MySqlConnection(connStr);

            try
            {
                conn.Open();
                string sql = "UPDATE stores_turnover SET revenue=revenue*1.07, store='expensive' WHERE piece<2000";
                MySqlCommand query = new MySqlCommand(sql, conn);
                query.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "HIBA");
            }
            conn.Close();
        }

        private void button6_Click(object sender, RoutedEventArgs e)
        {
            MySqlConnection conn = new MySqlConnection(connStr);

            try
            {
                conn.Open();
                string sql = "ALTER TABLE stores_turnover SET piece=CONCAT(piece, ' unit') WHERE store='expensive'";
                MySqlCommand query = new MySqlCommand(sql, conn);
                query.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "HIBA");
            }
            conn.Close();
        }

        private void button7_Click(object sender, RoutedEventArgs e)
        {
              MySqlConnection conn = new MySqlConnection(connStr);

            try
            {
                conn.Open();
                string sql = "UPDATE stores_turnover SET piece=CONCAT(piece,' unit' WHERE piece NOT LIKE unit";
                MySqlCommand query = new MySqlCommand(sql, conn);
                query.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "HIBA");
            }
            conn.Close();
       
        }

        private void button8_Click(object sender, RoutedEventArgs e)
        {
            StreamWriter ki = new StreamWriter("feladat11.txt");

            MySqlConnection conn = new MySqlConnection(connStr);

            try
            {
                conn.Open();
                string sql = "SELECT title, price FROM books WHERE price<(SELECT AVG(price) FROM books)";
                MySqlCommand query = new MySqlCommand(sql, conn);
                MySqlDataReader reader = query.ExecuteReader();

                while(reader.Read())
                {
                    ki.WriteLine(reader[0]+" " + reader[1]);
                }

                reader.Close();
                ki.Close();
            }
            catch(Exception ex)
            {
                MessageBox.Show(ex.Message, "HIBA");
            }
            conn.Close();
        }

        private void button9_Click(object sender, RoutedEventArgs e)
        {

            StreamWriter ki = new StreamWriter("task12.txt");
            MySqlConnection conn = new MySqlConnection(connStr);

            try
            {
                conn.Open();
                string sql = "CREATE TABLE bookcodes SELECT DISTINCT turnover.bookcode AS code FROM turnover, SELECT books.title FROM books, bookcodes WHERE books.bookcode IN (bookcodes.code);";
                MySqlCommand query = new MySqlCommand(sql, conn);
                MySqlDataReader reader = query.ExecuteReader();
                while (reader.Read())
                {
                    ki.WriteLine(reader[0]);
                }
                reader.Close();
                ki.Close();
            }
            catch(Exception ex)
            {
                MessageBox.Show(ex.Message, "HIBA");
            }
            conn.Close();

       
        }

        private void button10_Click(object sender, RoutedEventArgs e)
        {

            StreamWriter ki = new StreamWriter("task13.txt");
            MySqlConnection conn = new MySqlConnection(connStr);

            try
            {
                conn.Open();
                string sql = "SELECT books.title FROM books, bookcodes WHERE books.bookcode NOt IN (bookcodes.code);";
                MySqlCommand query = new MySqlCommand(sql, conn);
                MySqlDataReader reader = query.ExecuteReader();
                while (reader.Read())
                {
                    ki.WriteLine(reader[0]);
                }
                reader.Close();
                ki.Close();
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "HIBA");
            }
            conn.Close();

        }

        private void butt11_Click(object sender, RoutedEventArgs e)
        {
            MySqlConnection conn = new MySqlConnection(connStr);
            StreamWriter ki = new StreamWriter("task14.txt");
            try
            {
                conn.Open();
                string sql = "SELECT authors.lastname AS lastname ,authors.firstname AS firstname, books.title, books.price FROM authors INNER JOIN books ON authors.authorcode=books.authorcode WHERE authors.lastname='Zoltay' OR authors.lastname='Kovács' AND books.price BETWEEN 500 AND 1500;";
                MySqlCommand query = new MySqlCommand(sql, conn);
                MySqlDataReader reader = query.ExecuteReader();
                while (reader.Read())
                {
                    ki.WriteLine(reader[0] +" " + reader[1]+" " + reader[2]+" " + reader[3]);
                }
                reader.Close();
                ki.Close();
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "HIBA");
            }
            conn.Close();
        }

        private void butt12_Click(object sender, RoutedEventArgs e)
        {
            MySqlConnection conn = new MySqlConnection(connStr);
            StreamWriter ki = new StreamWriter("task15.txt");
            try
            {
                conn.Open();
                string sql = "SELECT authors.lastname, books.title FROM authors INNER JOIN books ON authors.authorcode=books.authorcode ORDER BY authors.lastname ASC, books.title DESC;";
                MySqlCommand query = new MySqlCommand(sql, conn);
                MySqlDataReader reader = query.ExecuteReader();
                while (reader.Read())
                {
                    ki.WriteLine(reader[0]+" " + reader[1]);
                }
                reader.Close();
                ki.Close();
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "HIBA");
            }
            conn.Close();
        }

        private void butt13_Click(object sender, RoutedEventArgs e)
        {
            StreamWriter ki = new StreamWriter("task16.txt");
            MySqlConnection conn = new MySqlConnection(connStr);
            try
            {
                conn.Open();
                string sql = "SELECT stores.storename, RIGHT(stores.phonenumber,7) FROM stores WHERE stores.city<>'Budapest'";
                MySqlCommand query = new MySqlCommand(sql, conn);
                MySqlDataReader reader = query.ExecuteReader();
                while(reader.Read())
                {
                    ki.WriteLine(reader[0]+" " + reader[1]);
                }
                reader.Close();
                ki.Close();
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "HIBA");
            }
            conn.Close();
        }

        private void butt14_Click(object sender, RoutedEventArgs e)
        {
            MySqlConnection conn = new MySqlConnection(connStr);
            StreamWriter ki = new StreamWriter("task17.txt");
            try
            {
                conn.Open();
                string sql = "SELECT authors.lastname, authors.firstname, MAX(books.price)-MIN(books.price) FROM authors INNER JOIN books ON authors.authorcode=books.authorcode GROUP BY authors.lastname, authors.firstname";
                MySqlCommand query = new MySqlCommand(sql, conn);
                MySqlDataReader reader = query.ExecuteReader();
                while (reader.Read())
                {
                    ki.WriteLine(reader[0] + " " + reader[1]+" " + reader[2]);
                }
                reader.Close();
                ki.Close();
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "HIBA");
            }
            conn.Close();
        }
    }
}