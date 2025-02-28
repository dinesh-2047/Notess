// Sample blog data
const blogData = [
    {
        title: "Understanding Artificial Intelligence",
        content: `This is an introduction to Artificial Intelligence, its history, and how it is shaping the future of technology.
        The concept of AI dates back to ancient history, where philosophers like Aristotle and others pondered the nature of intelligence and reasoning. However, it wasn't until the 1950s that AI began to take shape as a scientific discipline. Pioneering computer scientist Alan Turing laid the foundation for the modern field of AI with his Turing Test, which evaluates a machine's ability to exhibit intelligent behavior indistinguishable from that of a human.
        `,
        image: "../images/Understanding_AI_Blog.png"
    },
    {
        title: "Effective Study Techniques",
        content: `Explore effective study techniques that can improve retention, productivity, and academic success.
        Studying effectively is crucial for academic success and personal growth. With the right study techniques, students can maximize their learning potential, retain information better, and manage their time efficiently. The key to effective studying lies in finding methods that suit your learning style, staying disciplined, and continuously improving your study habits.
        Active recall is one of the most powerful techniques for improving memory retention. Instead of passively rereading notes or textbooks, active recall involves actively testing yourself on the material. For example, after reading a chapter, try to recall key concepts without looking at your notes. Use flashcards or quizzes to reinforce what you've learned. This technique helps strengthen the brain's ability to retrieve information and improves long-term retention.
        `,
        image: "../images/studytips.png"
    },
    {
        title: "Mastering Data Structures & Algorithms",
        content: `An introduction to key DSA concepts for placement preparation, along with resources for mastering them.In the world of computer science and programming, Data Structures and Algorithms form the foundational bedrock for solving problems efficiently and effectively. These concepts are not only essential for competitive programming and technical interviews but also for designing scalable and optimized software systems. Mastering data structures and algorithms (DSA) is crucial for any aspiring software engineer or computer scientist. This guide delves into why mastering DSA is important, key concepts to focus on, and tips for learning and applying them.`,
        image: "../images/Mastering_DSA.png"
    },
    {
        title: "The Power of Active Learning",
        content: `Discover how active learning techniques like group discussions and self-quizzing can boost comprehension and retention.Data Structures and Algorithms (DSA) are foundational concepts in computer science that form the backbone of efficient problem-solving and programming. Mastering these concepts is crucial for aspiring software developers, computer scientists, and engineers. The ability to design efficient algorithms and choose the right data structures can make a significant difference in the performance of software applications, particularly in solving real-world problems efficiently.`,
        image: "../images/Active-Learning.png"
    },
    {
        title: "Time Management Tips for Students",
        content: `Learn effective time management strategies to balance studies, assignments, and personal time.Effective time management is one of the most important skills students can develop. It helps them balance academic responsibilities, extracurricular activities, social life, and personal well-being. By managing time effectively, students can reduce stress, enhance productivity, and achieve academic success while maintaining a healthy lifestyle.`,
        image: "../images/Time_Management_Tips.png"
    },
    {
        title: "Role of Technology in Modern Education",
        content: `Explore how AI, e-learning platforms, and digital tools are transforming traditional education.In the digital age, technology has become an integral part of everyday life, and its influence on education is no exception. From online courses to advanced learning tools, technology is reshaping how education is delivered, accessed, and experienced. The role of technology in modern education is multifaceted, enhancing learning experiences, improving access to information, and providing teachers with powerful tools for engaging students`,
        image: "../images/Tech_in_Education.png"
    }
];

// Inject blog data into the page
const blogGrid = document.getElementById('blog-grid');

blogData.forEach((blog, index) => {
    const blogCard = document.createElement('div');
    blogCard.classList.add('blog-card');
    blogCard.innerHTML = `
        <img src="${blog.image}" alt="${blog.title}">
        <div class="blog-content">
            <h3>${blog.title}</h3>
            <p>${blog.content.substring(0,100)}</p>
            <a href="#" class="read-more" data-index="${index}">Read More</a>
        </div>
    `;
    blogGrid.appendChild(blogCard);
});

// Modal functionality
const modal = document.getElementById('blog-modal');
const closeBtn = document.querySelector('.close-btn');
const modalTitle = document.getElementById('modal-title');
const modalContent = document.getElementById('modal-content');

blogGrid.addEventListener('click', function (event) {
    if (event.target.classList.contains('read-more')) {
        event.preventDefault(); // Prevent default link behavior

        // Get the blog index from the clicked "Read More" button
        const blogIndex = event.target.getAttribute('data-index');
        const blog = blogData[blogIndex];

        // Update the modal with the correct blog title and content
        modalTitle.textContent = `${blog.title}`;
        modalContent.textContent = `${blog.content}`;
        // Show the modal
        modal.style.display = 'block';
    }
});

// Close the modal when the close button is clicked
closeBtn.addEventListener('click', function () {
    modal.style.display = 'none';
});

// Close the modal if the user clicks outside of it
window.addEventListener('click', function (event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});
