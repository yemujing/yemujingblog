// 模拟的产品数据
const productHuntData = [
    {
        id: 1,
        name: "Claude 3",
        description: "The most capable AI model by Anthropic",
        categories: ["AI", "Productivity", "Development"],
        votes: 1253,
        image: "https://ph-files.imgix.net/a4a26812-7f46-4c49-9ef9-a83d6e0c91d1.png",
        link: "https://claude.ai",
        maker: ["Anthropic"],
        pricing: "Free trial available",
        launchDate: "2024-03-19"
    },
    {
        id: 2,
        name: "Notion Calendar",
        description: "The connected calendar that brings your tasks & events together",
        categories: ["Productivity", "Calendar", "Task Management"],
        votes: 982,
        image: "https://ph-files.imgix.net/a3e7bd89-9872-4634-b886-5f63eca2f9ce.png",
        link: "https://notion.so/calendar",
        maker: ["Notion Team"],
        pricing: "Free plan available",
        launchDate: "2024-03-20"
    },
    {
        id: 3,
        name: "Perplexity AI",
        description: "AI search engine that delivers comprehensive answers",
        categories: ["AI", "Search", "Research"],
        votes: 856,
        image: "https://ph-files.imgix.net/d7bf7e5c-e5b9-4845-b4f0-95008a3c7a0b.png",
        link: "https://perplexity.ai",
        maker: ["Perplexity Team"],
        pricing: "Free & Pro plans",
        launchDate: "2024-03-20"
    },
    {
        id: 4,
        name: "Raycast AI",
        description: "The AI-powered launcher for your Mac",
        categories: ["Mac", "Productivity", "AI"],
        votes: 743,
        image: "https://ph-files.imgix.net/1b42c397-c8e4-4757-8a72-a0f4df305eac.png",
        link: "https://raycast.com",
        maker: ["Raycast Team"],
        pricing: "Free & Pro plans",
        launchDate: "2024-03-21"
    },
    {
        id: 5,
        name: "Cursor",
        description: "The AI-first code editor",
        categories: ["Developer Tools", "AI", "Productivity"],
        votes: 687,
        image: "https://ph-files.imgix.net/d1a35620-84e3-4045-a4e9-2e249cf6edf7.png",
        link: "https://cursor.sh",
        maker: ["Cursor Team"],
        pricing: "Free",
        launchDate: "2024-03-21"
    }
];

// 将数据保存到 localStorage
if (!localStorage.getItem('productHuntData')) {
    localStorage.setItem('productHuntData', JSON.stringify(productHuntData));
}

// 确保数据总是可用
if (!JSON.parse(localStorage.getItem('productHuntData'))) {
    localStorage.setItem('productHuntData', JSON.stringify(productHuntData));
} 