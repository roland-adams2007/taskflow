import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    CheckSquare,
    Menu,
    CheckCircle2,
    Users,
    Folder,
    Calendar,
    BarChart,
    Smartphone,
    Star,
    X,
    ChevronDown
} from 'lucide-react';
import dashboardImage from '../assets/dashboard.png';

const LandingPage = () => {
    const navigate = useNavigate();
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

    const handleScroll = (e, id) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        setIsMobileNavOpen(false);
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const fadeInUp = {
        initial: { y: 60, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { duration: 0.8, ease: "easeOut" }
    };

    const staggerChildren = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const hoverScale = {
        whileHover: {
            scale: 1.05,
            transition: { duration: 0.2 }
        },
        whileTap: { scale: 0.95 }
    };

    const floatingAnimation = {
        animate: {
            y: [0, -10, 0],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    const sidebarVariants = {
        open: {
            x: 0,
            opacity: 1,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        },
        closed: {
            x: "100%",
            opacity: 0,
            transition: {
                duration: 0.3,
                ease: "easeIn"
            }
        }
    };

    return (
        <div className="bg-gray-50 text-slate-900 overflow-hidden">
            {/* Navigation */}
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="bg-white border-b-2 border-gray-200 sticky top-0 z-50"
            >
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center gap-3 cursor-pointer"
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        >
                            <CheckSquare className="text-blue-500 text-3xl" />
                            <span className="text-2xl font-bold ">TaskFlow</span>
                        </motion.div>

                        <div className="hidden md:flex items-center gap-8">
                            {['features', 'how-it-works', 'testimonials'].map((item) => (
                                <motion.a
                                    key={item}
                                    href={`#${item}`}
                                    whileHover={{ y: -2 }}
                                    className="text-gray-600 hover:text-blue-500 font-medium transition-colors  capitalize"
                                    onClick={(e) => handleScroll(e, item)}
                                >
                                    {item.replace('-', ' ')}
                                </motion.a>
                            ))}
                        </div>

                        <div className="flex items-center gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/login')}
                                className="hidden md:inline-block text-gray-600 hover:text-blue-500 font-semibold transition-colors "
                            >
                                Sign In
                            </motion.button>
                            <motion.button
                                whileHover={{
                                    scale: 1.05,
                                    boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)"
                                }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/register')}
                                className="px-6 py-2.5 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all "
                            >
                                Get Started
                            </motion.button>
                            <button
                                className="md:hidden"
                                onClick={() => setIsMobileNavOpen(true)}
                            >
                                <Menu className="text-2xl" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Sidebar */}
                <motion.div
                    variants={sidebarVariants}
                    initial="closed"
                    animate={isMobileNavOpen ? "open" : "closed"}
                    className="fixed top-0 right-0 h-full w-64 bg-white shadow-2xl z-50 md:hidden"
                >
                    <div className="flex justify-end p-4">
                        <button onClick={() => setIsMobileNavOpen(false)}>
                            <X className="text-2xl text-gray-600" />
                        </button>
                    </div>
                    <div className="flex flex-col items-center gap-6 pt-8">
                        {['features', 'how-it-works', 'testimonials'].map((item) => (
                            <motion.a
                                key={item}
                                href={`#${item}`}
                                whileHover={{ x: 5 }}
                                className="text-gray-600 hover:text-blue-500 font-medium text-lg transition-colors  capitalize"
                                onClick={(e) => handleScroll(e, item)}
                            >
                                {item.replace('-', ' ')}
                            </motion.a>
                        ))}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                navigate('/login');
                                setIsMobileNavOpen(false);
                            }}
                            className="text-gray-600 hover:text-blue-500 font-semibold transition-colors  text-lg"
                        >
                            Sign In
                        </motion.button>
                        <motion.button
                            whileHover={{
                                scale: 1.05,
                                boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)"
                            }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                navigate('/register');
                                setIsMobileNavOpen(false);
                            }}
                            className="px-6 py-2.5 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all "
                        >
                            Get Started
                        </motion.button>
                    </div>
                </motion.div>
                {isMobileNavOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black md:hidden"
                        onClick={() => setIsMobileNavOpen(false)}
                    />
                )}
            </motion.nav>

            {/* Hero Section */}
            <section className="gradient-bg text-white py-20 md:py-32" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial="initial"
                            animate="animate"
                            variants={containerVariants}
                        >
                            <motion.h1
                                variants={itemVariants}
                                className="text-5xl md:text-6xl font-bold mb-6 leading-tight "
                            >
                                Streamline Your Workflow with TaskFlow
                            </motion.h1>
                            <motion.p
                                variants={itemVariants}
                                className="text-xl mb-8 text-gray-100 leading-relaxed "
                            >
                                The ultimate task management platform that helps teams collaborate, organize, and achieve more. Track projects, manage deadlines, and boost productivity all in one place.
                            </motion.p>
                            <motion.div
                                variants={itemVariants}
                                className="flex flex-col sm:flex-row gap-4"
                            >
                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(255,255,255,0.2)" }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => navigate('/register')}
                                    className="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg transition-all text-center "
                                >
                                    Join TaskFlow
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05, backgroundColor: "white", color: "#667eea" }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => navigate('/contact')}
                                    className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-bold text-lg transition-all text-center "
                                >
                                    Contact Sales
                                </motion.button>
                            </motion.div>
                            <motion.div
                                variants={itemVariants}
                                className="flex items-center gap-8 mt-8"
                            >
                                {[
                                    { number: "50K+", label: "Active Users" },
                                    { number: "1M+", label: "Tasks Completed" },
                                    { number: "4.9/5", label: "User Rating" }
                                ].map((stat, index) => (
                                    <motion.div
                                        key={stat.label}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.2 + 0.8 }}
                                    >
                                        <div className="text-3xl font-bold ">{stat.number}</div>
                                        <div className="text-gray-200 text-sm ">{stat.label}</div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 100, rotate: 5 }}
                            animate={{ opacity: 1, x: 0, rotate: 2 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            whileHover={{ rotate: 0 }}
                            className="hidden lg:block transition-transform duration-500"
                        >
                            <div className="bg-white rounded-2xl shadow-2xl p-8">
                                <motion.img
                                    src={dashboardImage}
                                    alt="TaskFlow Dashboard Preview"
                                    className="rounded-lg"
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ duration: 0.3 }}
                                />
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        animate={floatingAnimation}
                        className="flex justify-center mt-12"
                    >
                        <motion.div
                            whileHover={{ scale: 1.2 }}
                            className="flex flex-col items-center cursor-pointer"
                            onClick={(e) => handleScroll(e, 'features')}
                        >
                            <span className="text-gray-200 text-sm mb-2 ">Explore Features</span>
                            <ChevronDown className="text-white" />
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        variants={containerVariants}
                        className="text-center mb-16"
                    >
                        <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold mb-4 ">
                            Powerful Features for Modern Teams
                        </motion.h2>
                        <motion.p variants={itemVariants} className="text-xl text-gray-600 max-w-2xl mx-auto ">
                            Everything you need to manage projects, collaborate with your team, and stay organized.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        variants={staggerChildren}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {[
                            { icon: CheckCircle2, color: "blue", title: "Task Management", description: "Create, assign, and track tasks with ease. Set priorities, deadlines, and stay on top of your workload." },
                            { icon: Users, color: "green", title: "Team Collaboration", description: "Work together seamlessly with real-time updates, comments, and notifications for your entire team." },
                            { icon: Folder, color: "purple", title: "Project Organization", description: "Organize tasks into projects and track progress with visual dashboards and detailed analytics." },
                            { icon: Calendar, color: "orange", title: "Smart Scheduling", description: "Never miss a deadline with calendar integration and intelligent deadline reminders." },
                            { icon: BarChart, color: "red", title: "Analytics & Reports", description: "Get insights into team performance and project progress with comprehensive analytics." },
                            { icon: Smartphone, color: "cyan", title: "Mobile Access", description: "Stay productive on the go with our mobile app available on iOS and Android." }
                        ].map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                variants={fadeInUp}
                                whileHover={{
                                    y: -8,
                                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
                                }}
                                className="feature-card bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-blue-500 transition-all cursor-pointer"
                            >
                                <div className={`w-14 h-14 bg-${feature.color}-100 rounded-xl flex items-center justify-center text-${feature.color}-500 text-2xl mb-4`}>
                                    <feature.icon />
                                </div>
                                <h3 className="text-xl font-bold mb-3 ">{feature.title}</h3>
                                <p className="text-gray-600 ">{feature.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-20 bg-gray-100">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        variants={containerVariants}
                        className="text-center mb-16"
                    >
                        <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold mb-4 ">
                            How TaskFlow Works
                        </motion.h2>
                        <motion.p variants={itemVariants} className="text-xl text-gray-600 max-w-2xl mx-auto ">
                            Get started in minutes and transform the way your team works.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        variants={staggerChildren}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        {[
                            { number: 1, color: "blue", title: "Create Your Workspace", description: "Sign up and set up your workspace. Invite team members and create your first project in seconds." },
                            { number: 2, color: "green", title: "Organize Your Tasks", description: "Break down projects into manageable tasks. Assign responsibilities, set deadlines, and prioritize work." },
                            { number: 3, color: "purple", title: "Track & Achieve", description: "Monitor progress in real-time, collaborate with your team, and celebrate completed milestones." }
                        ].map((step, index) => (
                            <motion.div
                                key={step.number}
                                variants={fadeInUp}
                                whileHover={{ scale: 1.05 }}
                                className="text-center"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: 360 }}
                                    transition={{ duration: 0.5 }}
                                    className={`w-20 h-20 bg-${step.color}-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 `}
                                >
                                    {step.number}
                                </motion.div>
                                <h3 className="text-2xl font-bold mb-3 ">{step.title}</h3>
                                <p className="text-gray-600 ">{step.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="py-20 bg-slate-800 text-white"
            >
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        variants={staggerChildren}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
                    >
                        {[
                            { number: "50K+", label: "Happy Users" },
                            { number: "1M+", label: "Tasks Completed" },
                            { number: "15K+", label: "Active Projects" },
                            { number: "99.9%", label: "Uptime" }
                        ].map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                variants={itemVariants}
                                whileHover={{ scale: 1.05 }}
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1, type: "spring" }}
                                    className="text-5xl font-bold mb-2 "
                                >
                                    {stat.number}
                                </motion.div>
                                <div className="text-gray-300 ">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </motion.section>

            {/* Testimonials */}
            <section id="testimonials" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        variants={containerVariants}
                        className="text-center mb-16"
                    >
                        <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold mb-4 ">
                            Loved by Teams Worldwide
                        </motion.h2>
                        <motion.p variants={itemVariants} className="text-xl text-gray-600 max-w-2xl mx-auto ">
                            See what our customers have to say about TaskFlow.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        variants={staggerChildren}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        {[
                            {
                                initials: "SJ",
                                color: "blue",
                                name: "Sarah Johnson",
                                role: "Product Designer",
                                quote: "TaskFlow has completely transformed how our team manages projects. The interface is intuitive and the collaboration features are top-notch."
                            },
                            {
                                initials: "MC",
                                color: "green",
                                name: "Mike Chen",
                                role: "Frontend Developer",
                                quote: "We've tried many task management tools, but TaskFlow is by far the best. It's helped us increase productivity by 40%."
                            },
                            {
                                initials: "ER",
                                color: "orange",
                                name: "Emily Rodriguez",
                                role: "Project Manager",
                                quote: "The best investment we made for our team. TaskFlow keeps everyone aligned and projects moving forward smoothly."
                            }
                        ].map((testimonial, index) => (
                            <motion.div
                                key={testimonial.name}
                                variants={fadeInUp}
                                whileHover={{ y: -5 }}
                                className="bg-gray-50 rounded-xl p-8 border-2 border-gray-200"
                            >
                                <div className="flex items-center gap-1 mb-4 text-yellow-500">
                                    {[...Array(5)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ scale: 0 }}
                                            whileInView={{ scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.1 + i * 0.1 }}
                                        >
                                            <Star className="fill-current" />
                                        </motion.div>
                                    ))}
                                </div>
                                <p className="text-gray-700 mb-6 ">"{testimonial.quote}"</p>
                                <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 bg-${testimonial.color}-500 rounded-full flex items-center justify-center text-white font-bold `}>
                                        {testimonial.initials}
                                    </div>
                                    <div>
                                        <div className="font-bold ">{testimonial.name}</div>
                                        <div className="text-sm text-gray-500 ">{testimonial.role}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="py-20 gradient-bg text-white"
                style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
            >
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <motion.h2
                        initial={{ y: 30, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold mb-6 "
                    >
                        Ready to Transform Your Workflow?
                    </motion.h2>
                    <motion.p
                        initial={{ y: 30, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-xl mb-8 text-gray-100 "
                    >
                        Join thousands of teams already using TaskFlow to achieve more every day.
                    </motion.p>
                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <motion.button
                            whileHover={{
                                scale: 1.05,
                                boxShadow: "0 20px 40px rgba(255,255,255,0.3)"
                            }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/register')}
                            className="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg transition-all "
                        >
                            Join TaskFlow
                        </motion.button>
                        <motion.button
                            whileHover={{
                                scale: 1.05,
                                backgroundColor: "white",
                                color: "#667eea"
                            }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/contact')}
                            className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-bold text-lg transition-all "
                        >
                            Contact Sales
                        </motion.button>
                    </motion.div>
                    <motion.p
                        initial={{ y: 30, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="text-sm text-gray-200 mt-6 "
                    >
                        No credit card required • Easy setup • Cancel anytime
                    </motion.p>
                </div>
            </motion.section>

            {/* Footer */}
            <motion.footer
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="bg-slate-800 text-white py-12"
            >
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        variants={staggerChildren}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8"
                    >
                        <motion.div variants={itemVariants}>
                            <div className="flex items-center gap-3 mb-4">
                                <CheckSquare className="text-blue-500 text-3xl" />
                                <span className="text-2xl font-bold ">TaskFlow</span>
                            </div>
                            <p className="text-gray-400 ">Streamline your workflow and boost team productivity.</p>
                        </motion.div>

                        {[
                            {
                                title: "Product",
                                links: ["Features", "Pricing", "Security", "Roadmap"]
                            },
                            {
                                title: "Company",
                                links: ["About", "Blog", "Careers", "Contact"]
                            },
                            {
                                title: "Resources",
                                links: ["Documentation", "Help Center", "API", "Status"]
                            }
                        ].map((section, index) => (
                            <motion.div key={section.title} variants={itemVariants}>
                                <h4 className="font-bold mb-4 ">{section.title}</h4>
                                <ul className="space-y-2 text-gray-400 ">
                                    {section.links.map((link) => (
                                        <motion.li
                                            key={link}
                                            whileHover={{ x: 5, color: "white" }}
                                        >
                                            <a href="#" className="hover:text-white transition-colors">{link}</a>
                                        </motion.li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
                    >
                        <p className="text-gray-400 text-sm ">© 2025 TaskFlow. All rights reserved.</p>
                        <div className="flex gap-6">
                            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((link) => (
                                <motion.a
                                    key={link}
                                    href="#"
                                    whileHover={{ y: -2, color: "white" }}
                                    className="text-gray-400 hover:text-white transition-colors "
                                >
                                    {link}
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </motion.footer>
        </div>
    );
};

export default LandingPage;