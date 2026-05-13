<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  
  <xsl:template match="/">
    <html>
      <head>
        <title>PilotRecognition.com XML Sitemap</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: #f8fafc;
            color: #1e293b;
          }
          h1 {
            color: #1e293b;
            border-bottom: 3px solid #dc2626;
            padding-bottom: 10px;
          }
          .subtitle {
            color: #64748b;
            font-size: 14px;
            margin-bottom: 30px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          th {
            background: #1e293b;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: 600;
          }
          td {
            padding: 12px;
            border-bottom: 1px solid #e2e8f0;
          }
          tr:hover {
            background: #f1f5f9;
          }
          a {
            color: #2563eb;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
          .priority-high {
            color: #dc2626;
            font-weight: bold;
          }
          .priority-medium {
            color: #f59e0b;
          }
          .priority-low {
            color: #64748b;
          }
          .count {
            background: #dc2626;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
          }
          .category {
            margin-bottom: 30px;
          }
          .category-header {
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
            color: white;
            padding: 15px 20px;
            border-radius: 8px 8px 0 0;
            font-size: 18px;
            font-weight: 600;
          }
          .category-header.main { background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); }
          .category-header.enterprise { background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%); }
          .category-header.pilots { background: linear-gradient(135deg, #059669 0%, #047857 100%); }
          .category-header.industry { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); }
          .category-header.legal { background: linear-gradient(135deg, #64748b 0%, #475569 100%); }
          .category-table {
            margin-top: 0;
            border-radius: 0 0 8px 8px;
          }
          .category-table th {
            background: #f1f5f9;
            color: #1e293b;
            font-weight: 600;
            font-size: 12px;
            text-transform: uppercase;
          }
        </style>
      </head>
      <body>
        <h1>
          <span style="color: #1e293b;">Pilot</span><span style="color: #dc2626;">Recognition</span>.com XML Sitemap
        </h1>
        <p class="subtitle">
          This is the XML sitemap for Google Search Console and other search engines. 
          <span class="count"><xsl:value-of select="count(s:urlset/s:url)"/> URLs</span>
        </p>
        
        <!-- Main Pages -->
        <div class="category">
          <div class="category-header main">MAIN</div>
          <table class="category-table">
            <thead>
              <tr>
                <th>URL</th>
                <th>Last Modified</th>
                <th>Change Frequency</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="s:urlset/s:url[contains(s:loc, '/') and not(contains(s:loc, '/airline-expectations')) and not(contains(s:loc, '/discover-pathways')) and not(contains(s:loc, '/what-is-the-pilot-gap')) and not(contains(s:loc, '/programs')) and not(contains(s:loc, '/foundational-program')) and not(contains(s:loc, '/transition-program')) and not(contains(s:loc, '/airbus-aligned')) and not(contains(s:loc, '/pilot-recognition')) and not(contains(s:loc, '/recognition-career')) and not(contains(s:loc, '/become-member')) and not(contains(s:loc, '/benefits')) and not(contains(s:loc, '/news-updates')) and not(contains(s:loc, '/framework')) and not(contains(s:loc, '/enterprise')) and not(contains(s:loc, '/why-recognition')) and not(contains(s:loc, '/pilot-shortage')) and not(contains(s:loc, '/pilot-terminal')) and not(contains(s:loc, '/recognition-plus')) and not(contains(s:loc, '/professional-profile')) and not(contains(s:loc, '/career-tools')) and not(contains(s:loc, '/background-check')) and not(contains(s:loc, '/pilot-insurance')) and not(contains(s:loc, '/banking-finance')) and not(contains(s:loc, '/manufacturer')) and not(contains(s:loc, '/store')) and not(contains(s:loc, '/faq')) and not(contains(s:loc, '/blog')) and not(contains(s:loc, '/learn-about')) and not(contains(s:loc, '/general')) and not(contains(s:loc, '/privacy')) and not(contains(s:loc, '/terms')) and not(contains(s:loc, '/cookie')) and not(contains(s:loc, '/philippines')) and not(contains(s:loc, '/partners'))]">
              <tr>
                <td><a href="{s:loc}" target="_blank"><xsl:value-of select="s:loc"/></a></td>
                <td><xsl:value-of select="s:lastmod"/></td>
                <td><xsl:value-of select="s:changefreq"/></td>
                <td><xsl:choose><xsl:when test="s:priority >= 0.9"><span class="priority-high"><xsl:value-of select="s:priority"/></span></xsl:when><xsl:when test="s:priority >= 0.5"><span class="priority-medium"><xsl:value-of select="s:priority"/></span></xsl:when><xsl:otherwise><span class="priority-low"><xsl:value-of select="s:priority"/></span></xsl:otherwise></xsl:choose></td>
              </tr>
            </xsl:for-each>
            </tbody>
          </table>
        </div>
        
        <!-- Enterprise Pages -->
        <div class="category">
          <div class="category-header enterprise">ENTERPRISE</div>
          <table class="category-table">
            <thead>
              <tr>
                <th>URL</th>
                <th>Last Modified</th>
                <th>Change Frequency</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="s:urlset/s:url[contains(s:loc, '/enterprise-access') or contains(s:loc, '/manufacturer') or contains(s:loc, '/background-check') or contains(s:loc, '/partners/flight-schools')]">
              <tr>
                <td><a href="{s:loc}" target="_blank"><xsl:value-of select="s:loc"/></a></td>
                <td><xsl:value-of select="s:lastmod"/></td>
                <td><xsl:value-of select="s:changefreq"/></td>
                <td><xsl:choose><xsl:when test="s:priority >= 0.9"><span class="priority-high"><xsl:value-of select="s:priority"/></span></xsl:when><xsl:when test="s:priority >= 0.5"><span class="priority-medium"><xsl:value-of select="s:priority"/></span></xsl:when><xsl:otherwise><span class="priority-low"><xsl:value-of select="s:priority"/></span></xsl:otherwise></xsl:choose></td>
              </tr>
            </xsl:for-each>
            </tbody>
          </table>
        </div>
        
        <!-- For Pilots -->
        <div class="category">
          <div class="category-header pilots">FOR PILOTS</div>
          <table class="category-table">
            <thead>
              <tr>
                <th>URL</th>
                <th>Last Modified</th>
                <th>Change Frequency</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="s:urlset/s:url[contains(s:loc, '/programs') or contains(s:loc, '/foundational-program') or contains(s:loc, '/transition-program') or contains(s:loc, '/airbus-aligned') or contains(s:loc, '/pilot-recognition') or contains(s:loc, '/recognition-career') or contains(s:loc, '/become-member') or contains(s:loc, '/why-recognition') or contains(s:loc, '/pilot-terminal') or contains(s:loc, '/recognition-plus') or contains(s:loc, '/professional-profile') or contains(s:loc, '/career-tools') or contains(s:loc, '/pilot-insurance') or contains(s:loc, '/banking-finance') or contains(s:loc, '/philippines')]">
              <tr>
                <td><a href="{s:loc}" target="_blank"><xsl:value-of select="s:loc"/></a></td>
                <td><xsl:value-of select="s:lastmod"/></td>
                <td><xsl:value-of select="s:changefreq"/></td>
                <td><xsl:choose><xsl:when test="s:priority >= 0.9"><span class="priority-high"><xsl:value-of select="s:priority"/></span></xsl:when><xsl:when test="s:priority >= 0.5"><span class="priority-medium"><xsl:value-of select="s:priority"/></span></xsl:when><xsl:otherwise><span class="priority-low"><xsl:value-of select="s:priority"/></span></xsl:otherwise></xsl:choose></td>
              </tr>
            </xsl:for-each>
            </tbody>
          </table>
        </div>
        
        <!-- For Industry -->
        <div class="category">
          <div class="category-header industry">FOR INDUSTRY</div>
          <table class="category-table">
            <thead>
              <tr>
                <th>URL</th>
                <th>Last Modified</th>
                <th>Change Frequency</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="s:urlset/s:url[contains(s:loc, '/airline-expectations') or contains(s:loc, '/discover-pathways') or contains(s:loc, '/what-is-the-pilot-gap') or contains(s:loc, '/pilot-shortage') or contains(s:loc, '/benefits') or contains(s:loc, '/news-updates') or contains(s:loc, '/framework') or contains(s:loc, '/store') or contains(s:loc, '/faq') or contains(s:loc, '/blog') or contains(s:loc, '/learn-about') or contains(s:loc, '/general')]">
              <tr>
                <td><a href="{s:loc}" target="_blank"><xsl:value-of select="s:loc"/></a></td>
                <td><xsl:value-of select="s:lastmod"/></td>
                <td><xsl:value-of select="s:changefreq"/></td>
                <td><xsl:choose><xsl:when test="s:priority >= 0.9"><span class="priority-high"><xsl:value-of select="s:priority"/></span></xsl:when><xsl:when test="s:priority >= 0.5"><span class="priority-medium"><xsl:value-of select="s:priority"/></span></xsl:when><xsl:otherwise><span class="priority-low"><xsl:value-of select="s:priority"/></span></xsl:otherwise></xsl:choose></td>
              </tr>
            </xsl:for-each>
            </tbody>
          </table>
        </div>
        
        <!-- Legal Pages -->
        <div class="category">
          <div class="category-header legal">LEGAL</div>
          <table class="category-table">
            <thead>
              <tr>
                <th>URL</th>
                <th>Last Modified</th>
                <th>Change Frequency</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="s:urlset/s:url[contains(s:loc, '/privacy') or contains(s:loc, '/terms') or contains(s:loc, '/cookie')]">
              <tr>
                <td><a href="{s:loc}" target="_blank"><xsl:value-of select="s:loc"/></a></td>
                <td><xsl:value-of select="s:lastmod"/></td>
                <td><xsl:value-of select="s:changefreq"/></td>
                <td><xsl:choose><xsl:when test="s:priority >= 0.9"><span class="priority-high"><xsl:value-of select="s:priority"/></span></xsl:when><xsl:when test="s:priority >= 0.5"><span class="priority-medium"><xsl:value-of select="s:priority"/></span></xsl:when><xsl:otherwise><span class="priority-low"><xsl:value-of select="s:priority"/></span></xsl:otherwise></xsl:choose></td>
              </tr>
            </xsl:for-each>
            </tbody>
          </table>
        </div>
        
        <p style="margin-top: 30px; color: #64748b; font-size: 12px;">
          Generated for PilotRecognition.com - Aviation Industry's First Pilot Recognition-Based Platform
        </p>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
