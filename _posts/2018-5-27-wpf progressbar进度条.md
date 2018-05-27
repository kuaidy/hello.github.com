## C# 自定义控件样式

进度条常用在加载，下载，导出一些比较耗时的地方，利用进度条能让用户看到实时进展，能有更好的用户体验……

<!--more-->

##### 直接开始
新建一个wpf项目，然后在主窗口添加一个按钮，用来控制进度的开始。加一个进度条控件progressbar。双击按钮，为按钮添加事件，代码直接循环模仿进度的进行……

```C#
private void button4_Click(object sender, RoutedEventArgs e)
{
    for (int i = 0; i <= 100; i++)
        {
            //当前进度，最大值默认100
            progressBar1.Value = i;
            Thread.Sleep(10);
        }
}
```
最简单的进度条已经完成，好的，这里运行程序执行，你会发现一个问题，点开始之后，界面直接卡住，回过神来，进度条已经满了，这和我们想像有点也不一样啊。你在ui线程里面执行了耗时的操作，就会让界面进入假死状态，这时候我们就要改进一下，使用多线程。

![image.png](https://upload-images.jianshu.io/upload_images/3956112-17012b257ccc9885.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


##### 多线程开始
我们重新开启一个线程来模仿进度条进度，在按钮的点击事件下进行调用。好了，这次在点击按钮，我们可以看到进度条正常的显示进度情况了，不错，不错，是这种效果。
```C#
private void ProgressBegin() 
{

    Thread thread = new Thread(new ThreadStart(() =>
    {
        for (int i = 0; i <= 100; i++)
        {
            this.progressBar1.Dispatcher.BeginInvoke((ThreadStart)delegate{ this.progressBar1.Value = i; });
            Thread.Sleep(100);
        }

    }));
    thread.Start();
}
```
##### 新窗口来一个
这个写法是一样的，只不过在新窗口弄一个，用弹窗的方式来显示，有时候还是会用到的。新建一个wpf窗口，同样加入一个进度条控件，在主窗口的按钮点击事件中写入新窗口的创建和显示，在新窗口的构造函数中调用，进度条开始进度的方法。
```C#
//window1.xaml
<Window x:Class="progressbartest.Window1"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="Window1" Height="217" Width="300">
    <Grid>
        <ProgressBar Height="24" HorizontalAlignment="Left" Margin="12,72,0,0" Name="progressBar1" VerticalAlignment="Top" Width="254" Foreground="#FF2EAFF1" />
    </Grid>
</Window>
```
```C#
//window1.xaml.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;
using System.Threading;

namespace progressbartest
{
    /// <summary>
    /// Window1.xaml 的交互逻辑
    /// </summary>
    public partial class Window1 : Window
    {
        public Window1()
        {
            InitializeComponent();

            ProgressBegin();

        }

        private void ProgressBegin()
        {

            Thread thread = new Thread(new ThreadStart(() =>
            {
                for (int i = 0; i <= 100; i++)
                {
                    this.progressBar1.Dispatcher.BeginInvoke((ThreadStart)delegate { this.progressBar1.Value = i; });
                    Thread.Sleep(100);
                }

            }));
            thread.Start();
        }

    }
}

```
![image.png](https://upload-images.jianshu.io/upload_images/3956112-0fc7165ba589ded0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

##### BackgroundWork方式
BackgroundWorker类允许您在单独的线程上执行某个可能导致用户界面（UI）停止响应的耗时操作（比如文件下载数据库事务等），并且想要一个响应式的UI来反应当前耗时操作的进度。 那岂不是用来做进度条再合适不过了，可以利用单独线程来执行耗时操作，还能反应操作的进度。

当然，如果你要使用它提供的方法，必须要先设置一下它的某些属性，不然就没法使用，比如：要使用*ReportProgress()*（报告进度）的方法，先要设置*WorkerReportsProgress=true*。其他的设置，可以查官方文档哦。
```C#
private BackgroundWorker bgworker = new BackgroundWorker();

private void button3_Click(object sender, RoutedEventArgs e)
{
    InitWork();
    bgworker.RunWorkerAsync();
}

/// <summary>
/// 初始化bgwork
/// </summary>
private void InitWork()
{
    bgworker.WorkerReportsProgress = true;
    bgworker.DoWork += new DoWorkEventHandler(DoWork);
    bgworker.ProgressChanged += new ProgressChangedEventHandler(BgworkChange);
}

private void DoWork(object sender, DoWorkEventArgs e)
{
    for (int i = 0; i <= 100; i++)
    {
        bgworker.ReportProgress(i);
        Thread.Sleep(100);
    }
}

/// <summary>
///改变进度条的值
/// </summary>
private void BgworkChange(object sender, ProgressChangedEventArgs e) 
{
    this.progressBar1.Value = e.ProgressPercentage;
}
```
![image.png](https://upload-images.jianshu.io/upload_images/3956112-ec439664b9038ca9.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

##### 源代码
```
//mainwindow.xaml
<Window x:Class="progressbartest.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="MainWindow" Height="350" Width="525">
    <Grid>
        <ProgressBar Height="23" HorizontalAlignment="Left" Margin="32,124,0,0" Name="progressBar1" VerticalAlignment="Top" Width="432" />
        <Button Content="多线程开始" Height="23" HorizontalAlignment="Left" Margin="123,54,0,0" Name="button1" VerticalAlignment="Top" Width="75" Click="button1_Click" />
        <Button Content="新窗口开始" Height="23" HorizontalAlignment="Left" Margin="219,54,0,0" Name="button2" VerticalAlignment="Top" Width="75" Click="button2_Click" />
        <Button Content="BackgroundWorker方式" Height="23" HorizontalAlignment="Left" Margin="310,54,0,0" Name="button3" VerticalAlignment="Top" Width="154" Click="button3_Click" />
        <Button Content="开始" Height="23" HorizontalAlignment="Left" Margin="32,54,0,0" Name="button4" VerticalAlignment="Top" Width="75" Click="button4_Click" />
    </Grid>
</Window>
```
```c#
//mainwindow.xaml.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.Threading;
using System.ComponentModel;

namespace progressbartest
{
    /// <summary>
    /// MainWindow.xaml 的交互逻辑
    /// </summary>
    public partial class MainWindow : Window
    {
        private BackgroundWorker bgworker = new BackgroundWorker();

        public MainWindow()
        {
            InitializeComponent();
        }

        private void button1_Click(object sender, RoutedEventArgs e)
        {
            ProgressBegin();
        }

        private void ProgressBegin() 
        {

            Thread thread = new Thread(new ThreadStart(() =>
            {
                for (int i = 0; i <= 100; i++)
                {
                    this.progressBar1.Dispatcher.BeginInvoke((ThreadStart)delegate{ this.progressBar1.Value = i; });
                    Thread.Sleep(100);
                }

            }));
            thread.Start();
        }

        private void button2_Click(object sender, RoutedEventArgs e)
        {
            Window1 window = new Window1();
            window.Show();
        }

        /// <summary>
        /// 初始化bgwork
        /// </summary>
        private void InitWork()
        {
            bgworker.WorkerReportsProgress = true;
            bgworker.DoWork += new DoWorkEventHandler(DoWork);
            bgworker.ProgressChanged += new ProgressChangedEventHandler(BgworkChange);
        }


        private void DoWork(object sender, DoWorkEventArgs e)
        {
            for (int i = 0; i <= 100; i++)
            {
                bgworker.ReportProgress(i);
                Thread.Sleep(100);
            }
        }


        /// <summary>
        ///改变进度条的值
        /// </summary>
        private void BgworkChange(object sender, ProgressChangedEventArgs e) 
        {
            this.progressBar1.Value = e.ProgressPercentage;
        }

        private void button3_Click(object sender, RoutedEventArgs e)
        {
            InitWork();
            bgworker.RunWorkerAsync();
        }

        private void button4_Click(object sender, RoutedEventArgs e)
        {
            for (int i = 0; i <= 100; i++)
            {
                progressBar1.Value = i;
                Thread.Sleep(10);
            }
        }
    }
}
```
```
//window1.xaml
<Window x:Class="progressbartest.Window1"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="Window1" Height="217" Width="300">
    <Grid>
        <ProgressBar Height="24" HorizontalAlignment="Left" Margin="12,72,0,0" Name="progressBar1" VerticalAlignment="Top" Width="254" Foreground="#FF2EAFF1" />
    </Grid>
</Window>
```
```
//window1.xaml.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;
using System.Threading;

namespace progressbartest
{
    /// <summary>
    /// Window1.xaml 的交互逻辑
    /// </summary>
    public partial class Window1 : Window
    {
        public Window1()
        {
            InitializeComponent();

            ProgressBegin();

        }

        private void ProgressBegin()
        {

            Thread thread = new Thread(new ThreadStart(() =>
            {
                for (int i = 0; i <= 100; i++)
                {
                    this.progressBar1.Dispatcher.BeginInvoke((ThreadStart)delegate { this.progressBar1.Value = i; });
                    Thread.Sleep(100);
                }

            }));
            thread.Start();
        }

    }
}
```
##### 参考资料
>[BackgroundWorker使用总结](https://blog.csdn.net/coderookieguo/article/details/72723310)