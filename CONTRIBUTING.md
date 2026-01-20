# Contributing to Web App Template

Thank you for your interest in improving this template! This guide will help you get started with contributing.

## How to Contribute

### Reporting Issues

If you find a bug or have a feature request:

1. Check if the issue already exists in the GitHub Issues
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - Your environment (Node version, OS, etc.)

### Submitting Changes

1. **Fork the repository**
2. **Create a branch** for your feature or fix:
   ```bash
   git checkout -b feature/amazing-feature
   # or
   git checkout -b fix/bug-description
   ```

3. **Make your changes**:
   - Follow the existing code style
   - Keep changes focused and atomic
   - Test your changes thoroughly

4. **Commit your changes**:
   ```bash
   git commit -m "Add amazing feature"
   ```
   - Use clear, descriptive commit messages
   - Reference issues when applicable (#123)

5. **Push to your fork**:
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**:
   - Describe what changes you made and why
   - Link any related issues
   - Add screenshots for UI changes

## Development Guidelines

### Code Style

- Use TypeScript for type safety
- Follow existing naming conventions
- Use meaningful variable and function names
- Add comments for complex logic
- Keep components small and focused

### Component Guidelines

When adding UI components to `src/components/ui/`:

- Make them reusable and generic
- Use TypeScript for props
- Support common variants (size, color, etc.)
- Include proper accessibility attributes
- Document props with comments

Example:
```typescript
interface ButtonProps {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  // ... other props
}
```

### File Organization

```
src/
├── app/              # Next.js app router pages
├── components/
│   ├── ui/           # Reusable UI components
│   └── providers/    # Context providers
├── lib/              # Utilities and helpers
└── types/            # TypeScript type definitions
```

### Testing

- Test authentication flow
- Test payment flow (use Stripe test mode)
- Test on multiple browsers
- Verify mobile responsiveness

### Database Changes

If you modify the database schema:

1. Update `prisma/schema.prisma`
2. Create a migration:
   ```bash
   npm run db:migrate
   ```
3. Test migrations work on a fresh database
4. Document the changes in your PR

## What We're Looking For

### High Priority

- 🐛 Bug fixes
- 📚 Documentation improvements
- ♿ Accessibility improvements
- 🎨 UI/UX enhancements
- 🔒 Security improvements

### Feature Ideas

- Additional OAuth providers (GitHub, Twitter, etc.)
- Email authentication option
- Dark mode toggle
- Toast notifications
- File upload utilities
- Email integration (Resend, SendGrid)
- More UI components
- Animation examples
- Form validation utilities

### Not Accepting

- Breaking changes without discussion
- Features that make the template too opinionated
- Large dependencies for minor features
- Changes that remove core functionality

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Keep discussions focused and professional

## Questions?

- Open a GitHub Discussion for questions
- Check existing issues and PRs
- Review the documentation first

## License

By contributing, you agree that your contributions will be licensed under the same MIT License that covers this project.

---

Thank you for helping make this template better! 🎉
